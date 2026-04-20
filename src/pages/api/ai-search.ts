import type { APIRoute } from 'astro';

export const prerender = false;

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

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: AISearchRequest = await request.json();
    
    if (!body.query || body.query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const runtime = (locals as any).runtime;
    if (!runtime?.env?.AI) {
      return new Response(
        JSON.stringify({ 
          error: 'AI binding not available',
          message: 'AutoRAG is not configured. Please set up Cloudflare AI binding.'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const autoragName = runtime.env.AUTORAG_NAME || 'manual-book-rag';
    
    if (body.stream) {
      const streamResult = await runtime.env.AI
        .autorag(autoragName)
        .aiSearch({
          query: body.query,
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

    const result = await runtime.env.AI
      .autorag(autoragName)
      .aiSearch({
        query: body.query,
        rewrite_query: true,
      });

    const response: AISearchResponse = {
      answer: result.response || '',
      sources: (result.data || []).map((item: any) => ({
        content: item.content || '',
        filename: item.filename || '',
        score: item.score || 0,
      })),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Search error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
