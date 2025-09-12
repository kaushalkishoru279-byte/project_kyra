import { NextRequest, NextResponse } from 'next/server';
import { careChatFlow } from '@/ai/flows/carechat';
import { getDbPool } from '@/lib/db';
import { ensureChatTables } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    if (!(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY)) {
      return NextResponse.json({ reply: "CareChat is not configured. Please set GOOGLE_API_KEY or GEMINI_API_KEY in the environment." }, { status: 200 });
    }
    
    const { message, conversationId } = await req.json();
    if (!message || typeof message !== 'string') return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    
    const userId = req.headers.get('x-user-id') || 'default-user';
    await ensureChatTables();
    const pool = getDbPool();
    
    let currentConversationId = conversationId;
    
    // Create new conversation if none provided
    if (!currentConversationId) {
      const { rows } = await pool.query(`
        INSERT INTO public.chat_conversations (user_id, title)
        VALUES ($1, $2)
        RETURNING id
      `, [userId, 'New Chat']);
      currentConversationId = rows[0].id;
    }
    
    // Get conversation history
    const { rows: historyRows } = await pool.query(`
      SELECT role, content FROM public.chat_messages 
      WHERE conversation_id = $1 
      ORDER BY created_at ASC
    `, [currentConversationId]);
    
    const formattedHistory = historyRows.map(h => ({
      role: h.role as 'user' | 'assistant' | 'system',
      content: h.content
    }));
    
    // Save user message
    await pool.query(`
      INSERT INTO public.chat_messages (conversation_id, role, content)
      VALUES ($1, $2, $3)
    `, [currentConversationId, 'user', message]);
    
    // Get AI response
    const result = await careChatFlow({ 
      message, 
      history: formattedHistory 
    });
    
    // Save AI response
    await pool.query(`
      INSERT INTO public.chat_messages (conversation_id, role, content)
      VALUES ($1, $2, $3)
    `, [currentConversationId, 'assistant', result.reply]);
    
    // Update conversation timestamp
    await pool.query(`
      UPDATE public.chat_conversations 
      SET updated_at = NOW() 
      WHERE id = $1
    `, [currentConversationId]);
    
    return NextResponse.json({ 
      reply: result.reply, 
      conversationId: currentConversationId 
    });
  } catch (e) {
    console.error('CareChat error:', e);
    return NextResponse.json({ reply: "Sorry, I'm having trouble responding right now. Please try again in a moment." }, { status: 200 });
  }
}


