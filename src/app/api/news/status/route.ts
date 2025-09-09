import { NextRequest, NextResponse } from 'next/server';
import { ensureNewsTables, getDbPool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await ensureNewsTables();
    const pool = getDbPool();
    
    // Get article count by source
    const { rows } = await pool.query(`
      SELECT source, COUNT(*) as count, MAX(created_at) as latest
      FROM public.news_articles 
      GROUP BY source 
      ORDER BY count DESC
    `);
    
    // Get total count
    const { rows: totalRows } = await pool.query('SELECT COUNT(*) as total FROM public.news_articles');
    
    return NextResponse.json({
      status: 'success',
      totalArticles: totalRows[0].total,
      articlesBySource: rows,
      message: 'News system is working correctly'
    });
  } catch (error) {
    console.error('Error checking news status:', error);
    return NextResponse.json({ 
      status: 'error',
      error: 'Failed to check news status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
