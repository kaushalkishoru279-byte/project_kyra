import { NextRequest, NextResponse } from 'next/server';
import { NewsScraper } from '@/lib/news-scraper';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing RSS feeds...');
    
    // Test RSS feeds directly
    const rssArticles = await NewsScraper.scrapeRSSNews();
    
    return NextResponse.json({
      message: 'RSS test completed',
      count: rssArticles.length,
      articles: rssArticles.map(article => ({
        title: article.title,
        source: article.source,
        category: article.category,
        url: article.url
      }))
    });
  } catch (error) {
    console.error('Error testing RSS:', error);
    return NextResponse.json({ 
      error: 'RSS test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


