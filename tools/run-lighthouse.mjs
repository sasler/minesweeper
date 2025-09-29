import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const isWindows = process.platform === 'win32';

function run(command, args, options = {}) {
  const finalCommand = isWindows ? 'cmd.exe' : command;
  const finalArgs = isWindows ? ['/d', '/s', '/c', [command, ...args].join(' ')] : args;
  return new Promise((resolve, reject) => {
    const child = spawn(finalCommand, finalArgs, { stdio: 'inherit', shell: false, ...options });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        const error = new Error(`${command} ${args.join(' ')} exited with code ${code}`);
        error.code = code;
        reject(error);
      }
    });
    child.on('error', reject);
  });
}

async function main() {
  const chromePath = chromium.executablePath();
  if (!chromePath) {
    throw new Error('Unable to resolve Playwright Chromium executable path');
  }

  const env = { ...process.env, LHCI_CHROME_PATH: chromePath };
  const npmCmd = 'npm';
  const npxCmd = 'npx';

  await run(npmCmd, ['run', 'build'], { env });
  await run(npxCmd, ['lhci', 'autorun', '--config=lighthouserc.json'], { env });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(typeof error.code === 'number' ? error.code : 1);
});
