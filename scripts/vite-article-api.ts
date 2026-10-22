import { Readable } from 'node:stream';
import type { Plugin } from 'vite';

/** Dev and production call the same Cloudflare handlers. No mock extraction or
 * development-only database credentials are needed to work on the reader. */
export function articleApiPlugin(): Plugin {
  return {
    name: 'local-article-api', apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', async (request, response, next) => {
        const route = request.url?.split('?')[0];
        if (route === '/local-status') {
          response.setHeader('Content-Type', 'application/json');
          response.setHeader('Cache-Control', 'no-store');
          response.end(JSON.stringify({ application: 'social-commons' }));
          return;
        }
        if (!['/extract-article', '/article-image'].includes(route || '')) return next();
        try {
          const headers = new Headers();
          for (const [key, value] of Object.entries(request.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
          const method = request.method || 'GET';
          const input = new Request(`http://localhost/api${request.url}`, {
            method, headers, ...(method === 'GET' || method === 'HEAD' ? {} : { body: Readable.toWeb(request) as ReadableStream, duplex: 'half' }),
          } as RequestInit);
          const handler = await server.ssrLoadModule(`/functions/api${route}.ts`);
          const result: Response = await handler.onRequest({ request: input, env: {} });
          response.statusCode = result.status;
          result.headers.forEach((value, key) => response.setHeader(key, value));
          response.end(Buffer.from(await result.arrayBuffer()));
        } catch (error) {
          server.config.logger.error(`Local article API failed: ${error instanceof Error ? error.message : 'unknown error'}`);
          response.statusCode = 500;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ error: '本地接口启动失败，请查看终端日志' }));
        }
      });
    },
  };
}
