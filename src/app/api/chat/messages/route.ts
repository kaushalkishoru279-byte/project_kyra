import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { ensureChatTables } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await ensureChatTables();
    const pool = getDbPool();
    
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }
    
    const userId = req.headers.get('x-user-id') || 'default-user';
    
    // Verify ownership and get messages
    const { rows } = await pool.query(`
      SELECT m.id, m.role, m.content, m.created_at
      FROM public.chat_messages m
      JOIN public.chat_conversations c ON c.id = m.conversation_id
      WHERE m.conversation_id = $1 AND c.user_id = $2
      ORDER BY m.created_at ASC
    `, [conversationId, userId]);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureChatTables();
    const pool = getDbPool();
    
    const { conversationId, role, content } = await req.json();
    
    if (!conversationId || !role || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (!['user', 'assistant', 'system'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    
    const userId = req.headers.get('x-user-id') || 'default-user';
    
    // Verify ownership before adding message
    const { rows: convRows } = await pool.query(`
      SELECT id FROM public.chat_conversations 
      WHERE id = $1 AND user_id = $2
    `, [conversationId, userId]);
    
    if (convRows.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    // Insert message
    const { rows } = await pool.query(`
      INSERT INTO public.chat_messages (conversation_id, role, content)
      VALUES ($1, $2, $3)
      RETURNING id, role, content, created_at
    `, [conversationId, role, content]);
    
    // Update conversation's updated_at timestamp
    await pool.query(`
      UPDATE public.chat_conversations 
      SET updated_at = NOW() 
      WHERE id = $1
    `, [conversationId]);
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
