import * as cron from 'node-cron';
import { NewsScraper } from './news-scraper';
import { ensureNewsTables, getDbPool } from './db';

export class NewsScheduler {
  private static isRunning = false;
  private static isScraping = false;

  static start() {
    if (this.isRunning) {
      console.log('News scheduler is already running');
      return;
    }

    console.log('Starting news scheduler...');
    this.isRunning = true;

    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
      console.log('Running scheduled news scraping job...');
      await this.runScrapingJob();
    });

    // Run every 12 hours for updates (6 AM and 6 PM)
    cron.schedule('0 6,18 * * *', async () => {
      console.log('Running periodic news scraping job...');
      await this.runScrapingJob();
    });

    // Run immediately on startup (for development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Running initial news scraping job...');
      setTimeout(() => this.runScrapingJob(), 5000); // Wait 5 seconds after startup
    }

    console.log('News scheduler started successfully');
  }

  static stop() {
    if (!this.isRunning) {
      console.log('News scheduler is not running');
      return;
    }

    cron.destroy();
    this.isRunning = false;
    console.log('News scheduler stopped');
  }

  private static async runScrapingJob() {
    // Prevent concurrent scraping jobs
    if (this.isScraping) {
      console.log('News scraping job already in progress, skipping...');
      return;
    }

    this.isScraping = true;
    
    try {
      await ensureNewsTables();
      const pool = getDbPool();
      
      console.log('Starting news scraping job...');
      
      // Scrape news from all sources
      const articles = await NewsScraper.scrapeAllNews();
      console.log(`Scraped ${articles.length} articles`);

      if (articles.length === 0) {
        console.log('No articles found');
        return;
      }

      // Clear old articles (older than 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const deleteResult = await pool.query(
        'DELETE FROM public.news_articles WHERE published_at < $1',
        [sevenDaysAgo.toISOString()]
      );
      console.log(`Deleted ${deleteResult.rowCount} old articles`);

      // Insert new articles
      let insertedCount = 0;
      for (const article of articles) {
        try {
          // Check if article already exists (by URL)
          const existing = await pool.query(
            'SELECT id FROM public.news_articles WHERE url = $1',
            [article.url]
          );

          if (existing.rows.length === 0) {
            await pool.query(
              `INSERT INTO public.news_articles (title, description, url, image_url, source, published_at, category)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
            insertedCount++;
          }
        } catch (error) {
          console.error(`Error inserting article "${article.title}":`, error);
          // Continue with other articles
        }
      }

      console.log(`Successfully inserted ${insertedCount} new articles`);

    } catch (error) {
      console.error('Error in scheduled news scraping job:', error);
    } finally {
      this.isScraping = false;
    }
  }

  static async runNow() {
    console.log('Manually triggering news scraping job...');
    await this.runScrapingJob();
  }
}
