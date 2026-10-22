import { mkdir } from 'node:fs/promises';
import { createServer as createTcpServer } from 'node:net';
import { spawn } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const address = 'http://127.0.0.1:5180';
const temporaryDirectory = path.join(root, '.artifacts', 'temp');
await mkdir(temporaryDirectory, { recursive: true });
process.env.TEMP = process.env.TMP = temporaryDirectory;
process.env.npm_config_cache = path.join(root, '.artifacts', 'npm-cache');
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) process.env.NODE_USE_ENV_PROXY = '1';

function openReader() {
  if (process.argv.includes('--no-open')) return;
  // Only the fixed local URL is passed to the operating system.
  spawn('rundll32.exe', ['url.dll,FileProtocolHandler', `${address}/reading`], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  }).unref();
}

async function existingService() {
  try {
    const response = await fetch(`${address}/api/local-status`, {
      signal: AbortSignal.timeout(1500),
    });
    return response.ok && (await response.json()).application === 'social-commons';
  } catch {
    return false;
  }
}

if (await existingService()) {
  console.log('社科通识已经在运行，直接打开阅读空间即可。');
  openReader();
} else {
  const available = await new Promise((resolve) => {
    const probe = createTcpServer();
    probe.once('error', () => resolve(false));
    probe.listen(5180, '127.0.0.1', () => probe.close(() => resolve(true)));
  });
  if (!available) {
    console.error('端口 5180 被其他程序占用。请关闭占用它的程序后重试；不会自动结束进程或换端口。');
    process.exitCode = 1;
  } else {
    const { createServer } = await import('vite');
    const server = await createServer({ root });
    await server.listen();
    console.log(`社科通识已启动：${address}/reading`);
    console.log('保留此窗口即可使用；关闭窗口会停止本机服务。');
    openReader();
  }
}
