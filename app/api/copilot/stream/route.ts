const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

// Stream live; never cache.
export const dynamic = 'force-dynamic';
// The Copilot pipeline (intent + deal sourcing + LLM memo) runs longer than the
// default serverless limit, so allow up to 60s for the streamed response.
export const maxDuration = 60;

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as { message?: string };
  if (!body.message) {
    return Response.json({ error: 'message is required' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${AGENTS_URL}/copilot/stream`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: body.message, with_memo: true }),
    });
  } catch {
    return Response.json({ error: 'Agents service unreachable' }, { status: 502 });
  }

  // Pass through error responses (e.g. 503 when no provider is configured).
  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    return new Response(text || JSON.stringify({ error: `Agents error (${upstream.status})` }), {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    });
  }

  // Pipe the Server-Sent Events stream straight through to the browser.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  });
}
