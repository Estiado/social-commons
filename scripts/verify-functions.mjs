import assert from 'node:assert/strict';
import { build } from 'vite';

// 使用已有构建工具校验 Workers 浏览器运行时依赖，无需另装 CLI 或写入 C 盘。
await build({ configFile: false, publicDir: false, build: {
  lib: { entry: { 'extract-article': 'functions/api/extract-article.ts', 'article-image': 'functions/api/article-image.ts' }, formats: ['es'], fileName: (_format, name) => `${name}.js` },
  outDir: '.artifacts/functions', emptyOutDir: true, minify: true,
} });
const { onRequest } = await import('../.artifacts/functions/extract-article.js');
const response = await onRequest({ request: new Request('https://site.test/api/extract-article'), env: {} });
assert.equal(response.status, 405);
assert.match(response.headers.get('content-type'), /application\/json/);
console.log('Bundled Cloudflare function: GET -> JSON 405');
const { onRequest: imageRequest } = await import('../.artifacts/functions/article-image.js');
const imageResponse = await imageRequest({ request: new Request('https://site.test/api/article-image?url=https://localhost/private.png'), env: {} });
assert.equal(imageResponse.status, 400);
console.log('Bundled image function: private address -> JSON 400');
