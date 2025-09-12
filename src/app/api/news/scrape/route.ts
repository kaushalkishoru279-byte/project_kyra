import { NextRequest, NextResponse } from 'next/server';
import { ensureNewsTables, getDbPool } from '@/lib/db';
import { NewsScraper } from '@/lib/news-scraper';

export async function POST(req: NextRequest) {
  await ensureNewsTables();
  const pool = getDbPool();
  
  try {
    console.log('Starting news scraping job...');
    
    // Scrape news from all sources
    const articles = await NewsScraper.scrapeAllNews();
    console.log(`Scraped ${articles.length} articles`);

    if (articles.length === 0) {
      return NextResponse.json({ 
        message: 'No articles found', 
        count: 0 
      });
    }

    // Clear old articles (older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    await pool.query(
      'DELETE FROM public.news_articles WHERE published_at < $1',
      [sevenDaysAgo.toISOString()]
    );

    // Insert new articles
    const insertedArticles = [];
    for (const article of articles) {
      try {
        // Check if article already exists (by URL)
        const existing = await pool.query(
          'SELECT id FROM public.news_articles WHERE url = $1',
          [article.url]
        );

        if (existing.rows.length === 0) {
          const { rows } = await pool.query(
            `INSERT INTO public.news_articles (title, description, url, image_url, source, published_at, category)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, title, source`,
            [
              article.title,
              article.description || null,
              article.url,
              article.imageUrl || null,
              article.source,
              article.publishedAt,
              article.category || null
            ]
          );
          insertedArticles.push(rows[0]);
        }
      } catch (error) {
        console.error(`Error inserting article "${article.title}":`, error);
        // Continue with other articles
      }
    }

    console.log(`Successfully inserted ${insertedArticles.length} new articles`);

    return NextResponse.json({
      message: 'News scraping completed successfully',
      totalScraped: articles.length,
      newArticles: insertedArticles.length,
      articles: insertedArticles
    });

  } catch (error) {
    console.error('Error in news scraping job:', error);
    return NextResponse.json({ 
      error: 'Failed to scrape news',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Manual trigger for testing
  return POST(req);
}


