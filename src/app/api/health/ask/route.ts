import { NextRequest, NextResponse } from 'next/server';
import { healthQAFlow } from '@/ai/flows/health-qa';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, context } = body || {};
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }
    const result = await healthQAFlow({ question, context });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}



