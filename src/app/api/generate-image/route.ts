import { NextRequest, NextResponse } from 'next/server';
import { generateWordIllustration } from '@/lib/gemini';

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 25;

const ipRequestTimestamps = new Map<string, number[]>();

function checkRateLimit(clientKey: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestTimestamps.get(clientKey) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestTimestamps.set(clientKey, recent);
    return false;
  }

  recent.push(now);
  ipRequestTimestamps.set(clientKey, recent);
  return true;
}

const VALID_WORD_PATTERN = /^[a-zA-Z0-9\s\-'&/]+$/;

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'local';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          error:
            'Too many preview requests in a short period. Please wait a moment and try again.',
        },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request payload must be a JSON object.' },
        { status: 400 }
      );
    }

    const { word, category } = body as { word?: unknown; category?: unknown };

    if (typeof word !== 'string') {
      return NextResponse.json(
        { error: 'A valid target word string is required.' },
        { status: 400 }
      );
    }

    const trimmedWord = word.trim();
    if (trimmedWord.length < 1 || trimmedWord.length > 50) {
      return NextResponse.json(
        { error: 'Word length must be between 1 and 50 characters.' },
        { status: 400 }
      );
    }

    if (!VALID_WORD_PATTERN.test(trimmedWord)) {
      return NextResponse.json(
        { error: 'Word contains unsupported characters.' },
        { status: 400 }
      );
    }

    const sanitizedCategory =
      typeof category === 'string' && category.trim().length <= 40
        ? category.trim()
        : 'General';

    const result = await generateWordIllustration({
      word: trimmedWord,
      category: sanitizedCategory,
    });

    if (result.source === 'unavailable' || !result.imageUrl) {
      return NextResponse.json(
        {
          error:
            result.error ||
            `No illustration is currently available for "${trimmedWord}". Please retry.`,
          word: result.word,
          category: result.category,
          drawingDescription: result.drawingDescription,
          drawingSteps: result.drawingSteps,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error:
          'Unable to generate drawing preview right now. Please try again.',
      },
      { status: 500 }
    );
  }
}
