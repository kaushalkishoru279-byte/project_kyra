import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { ensureChatTables } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await ensureChatTables();
    const pool = getDbPool();
    
    // Get user ID from headers (stub for now)
    const userId = req.headers.get('x-user-id') || 'default-user';
    
    const { rows } = await pool.query(`
      SELECT id, title, created_at, updated_at
      FROM public.chat_conversations 
      WHERE user_id = $1 
      ORDER BY updated_at DESC
    `, [userId]);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureChatTables();
    const pool = getDbPool();
    
    const { title } = await req.json();
    const userId = req.headers.get('x-user-id') || 'default-user';
    
    const { rows } = await pool.query(`
      INSERT INTO public.chat_conversations (user_id, title)
      VALUES ($1, $2)
      RETURNING id, title, created_at, updated_at
    `, [userId, title || 'New Chat']);
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureChatTables();
    const pool = getDbPool();
    
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('id');
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }
    
    const userId = req.headers.get('x-user-id') || 'default-user';
    
    // Verify ownership before deleting
    const { rows } = await pool.query(`
      DELETE FROM public.chat_conversations 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [conversationId, userId]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}
