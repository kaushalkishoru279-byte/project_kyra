import { NextRequest, NextResponse } from 'next/server';
import { ensureNewsTables, getDbPool } from '@/lib/db';

export async function GET(req: NextRequest) {
  await ensureNewsTables();
  const pool = getDbPool();
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const source = url.searchParams.get('source');
  const category = url.searchParams.get('category');

  try {
    let query = `
      SELECT id, title, description, url, image_url, source, published_at, category, created_at
      FROM public.news_articles
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (source) {
      query += ` AND source = $${paramCount}`;
      params.push(source);
      paramCount++;
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    query += ` ORDER BY published_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    const { rows } = await pool.query(query, params);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await ensureNewsTables();
  const pool = getDbPool();
  
  try {
    const body = await req.json();
    const { title, description, url, imageUrl, source, publishedAt, category } = body;

    if (!title || !url || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO public.news_articles (title, description, url, image_url, source, published_at, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, url, image_url, source, published_at, category, created_at`,
      [title, description || null, url, imageUrl || null, source, publishedAt || new Date(), category || null]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 });
  }
}
