import childProcess from 'node:child_process';
import fs from 'node:fs';

const REPOSITORY_DIRECTORY = new URL('./test262/', import.meta.url);
const COMMIT_HASH_FILE = new URL('./test262-commit-hash', import.meta.url);
const runCommand = (command, options) => {
  console.debug(`Running '${command}'`);

  return childProcess.execSync(command, {
    cwd: REPOSITORY_DIRECTORY,
    stdio: 'inherit',
    encoding: 'utf8',
    ...options,
  });
};

async function downloadTest262Internal() {
  if (!fs.existsSync(REPOSITORY_DIRECTORY)) {
    runCommand('git clone --depth=1 https://github.com/tc39/test262.git', {
      cwd: new URL('./', import.meta.url),
    });
  }

  const COMMIT_HASH = fs.readFileSync(COMMIT_HASH_FILE, 'utf8').trim();
  const currentCommit = runCommand('git rev-parse HEAD', { stdio: 'pipe' }).trim();

  if (currentCommit === COMMIT_HASH) {
    return;
  }

  runCommand(`git fetch --depth=1 origin ${COMMIT_HASH}`);
  runCommand(`git reset --hard ${COMMIT_HASH}`);
}

let promise;
function downloadTest262() {
  promise ??= downloadTest262Internal();
  return promise;
}

export default downloadTest262;
