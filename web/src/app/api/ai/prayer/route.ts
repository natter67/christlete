import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase-server';

export const maxDuration = 30;

const FEELING_CONTEXT: Record<string, string> = {
  anxious: 'feeling anxious and nervous',
  confident: 'feeling confident and ready to compete',
  tired: 'feeling physically and mentally exhausted',
  grateful: 'feeling grateful and blessed',
  overwhelmed: 'feeling overwhelmed by pressure and circumstance',
  focused: 'feeling locked in, sharp, and focused',
};

const MAX_CARRYING_LENGTH = 500;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  // Auth check -- only signed-in users
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let feeling: string, carrying: string | undefined;
  try {
    ({ feeling, carrying } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!feeling || typeof feeling !== 'string') {
    return NextResponse.json({ error: 'Missing feeling' }, { status: 400 });
  }

  // Sanitize carrying input to prevent prompt injection and limit length
  const sanitizedCarrying = carrying?.trim().slice(0, MAX_CARRYING_LENGTH);

  const feelingDesc = FEELING_CONTEXT[feeling] ?? 'preparing to compete';
  const carryingLine = sanitizedCarrying
    ? `They are also carrying this specific burden or intention: "${sanitizedCarrying}".`
    : '';

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      thinking: { type: 'adaptive' },
      system: `You are a chaplain for Christian athletes. You write short, sincere, personal pregame prayers.

Rules:
- 3-5 sentences. No longer.
- Speak directly to God (start with "Lord,", "Father,", "God,", or "Father God,").
- Address the athlete's specific feeling and burden honestly.
- End with "Amen."
- Do not add commentary before or after the prayer.
- Tone: honest, grounded, not preachy. Like a teammate who also prays.`,
      messages: [
        {
          role: 'user',
          content: `Write a pregame prayer for a Christian athlete who is ${feelingDesc}. ${carryingLine}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No prayer generated' }, { status: 500 });
    }

    return NextResponse.json({ prayer: textBlock.text });
  } catch (err) {
    console.error('Prayer generation error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to generate prayer' }, { status: 500 });
  }
}
