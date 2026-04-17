import type { APIRoute } from 'astro';

export const prerender = false;

// Upper bounds for user-supplied input. The AI backend is an expensive
// resource, so we cap request size and query length to avoid abuse.
const MAX_BODY_BYTES = 8 * 1024; // 8 KB
const MAX_QUERY_LENGTH = 1000;

interface AISearchRequest {
  query: string;
  stream?: boolean;
}

interface SearchResult {
  content: string;
  filename: string;
  score: number;
}

interface AISearchResponse {
  answer: string;
  sources: SearchResult[];
}

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

function jsonError(status: number, error: string, message?: string): Response {
  const body: Record<string, string> = { error };
  if (message) body.message = message;
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Reject oversized request bodies early (defense against large payload DoS).
    const contentLength = Number(request.headers.get('content-length') ?? '0');
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return jsonError(413, 'Payload too large');
    }

    let body: AISearchRequest;
    try {
      body = (await request.json()) as AISearchRequest;
    } catch {
      return jsonError(400, 'Invalid JSON body');
    }

    if (!body || typeof body.query !== 'string') {
      return jsonError(400, 'Query is required');
    }

    const query = body.query.trim();
    if (query.length === 0) {
      return jsonError(400, 'Query is required');
    }
    if (query.length > MAX_QUERY_LENGTH) {
      return jsonError(400, 'Query too long');
    }

    const runtime = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime;
    const env = runtime?.env as { AI?: any; AUTORAG_NAME?: string } | undefined;
    if (!env?.AI) {
      return jsonError(
        503,
        'AI binding not available',
        'AutoRAG is not configured. Please set up Cloudflare AI binding.',
      );
    }

    const autoragName = env.AUTORAG_NAME || 'manual-book-rag';

    if (body.stream === true) {
      const streamResult = await env.AI
        .autorag(autoragName)
        .aiSearch({
          query,
          stream: true,
          rewrite_query: true,
        });

      return new Response(streamResult, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const result = await env.AI
      .autorag(autoragName)
      .aiSearch({
        query,
        rewrite_query: true,
      });

    const response: AISearchResponse = {
      answer: typeof result?.response === 'string' ? result.response : '',
      sources: Array.isArray(result?.data)
        ? result.data.map((item: any) => ({
            content: typeof item?.content === 'string' ? item.content : '',
            filename: typeof item?.filename === 'string' ? item.filename : '',
            score: typeof item?.score === 'number' ? item.score : 0,
          }))
        : [],
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: JSON_HEADERS,
    });

  } catch (error) {
    // Log full error server-side; return a generic message to clients so we
    // don't leak internal details, stack traces, or upstream provider errors.
    console.error('AI Search error:', error);
    return jsonError(500, 'Search failed', 'An internal error occurred.');
  }
};
