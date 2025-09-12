import { NextRequest, NextResponse } from 'next/server';
import { NewsScraper } from '@/lib/news-scraper';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing individual news sources...');
    
    const results = {
      bbc: await NewsScraper.scrapeBBCNews(),
      ndtv: await NewsScraper.scrapeNDTVNews(),
      guardian: await NewsScraper.scrapeGuardianNews(),
      rss: await NewsScraper.scrapeRSSNews(),
      all: await NewsScraper.scrapeAllNews()
    };

    return NextResponse.json({
      message: 'News scraping test completed',
      results: {
        bbc: { count: results.bbc.length, articles: results.bbc },
        ndtv: { count: results.ndtv.length, articles: results.ndtv },
        guardian: { count: results.guardian.length, articles: results.guardian },
        rss: { count: results.rss.length, articles: results.rss },
        all: { count: results.all.length, articles: results.all }
      }
    });
  } catch (error) {
    console.error('Error in test scraping:', error);
    return NextResponse.json({ 
      error: 'Test scraping failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


