import assert from 'node:assert/strict';
import { build } from 'vite';

// 使用已有构建工具校验 Workers 浏览器运行时依赖，无需另装 CLI 或写入 C 盘。
await build({ configFile: false, build: {
  lib: { entry: 'functions/api/extract-article.ts', formats: ['es'], fileName: 'extract-article' },
  outDir: '.artifacts/functions', emptyOutDir: true, minify: true,
} });
const { onRequest } = await import('../.artifacts/functions/extract-article.js');
const response = await onRequest({ request: new Request('https://site.test/api/extract-article'), env: {} });
assert.equal(response.status, 405);
assert.match(response.headers.get('content-type'), /application\/json/);
console.log('Bundled Cloudflare function: GET -> JSON 405');
