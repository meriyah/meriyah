const { readFile, writeFile } = require('fs');
const project = require('./project');

async function loadPackageJson(isLockfile) {
  const file = isLockfile ? 'package-lock.json' : 'package.json';
  return new Promise((resolve, reject) => {
    readFile(project[file].path, (err, data) => {
      if (err) {
        reject(err);
      }
      const str = data.toString('utf8');
      const json = JSON.parse(str);
      resolve(json);
    });
  });
}

async function savePackageJson(pkg, isLockfile) {
  const file = isLockfile ? 'package-lock.json' : 'package.json';
  return new Promise((resolve, reject) => {
    const str = JSON.stringify(pkg, null, 2);
    writeFile(project[file].path, str, { encoding: 'utf8' }, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

async function run() {
  /*eslint-disable*/
  const versionRegExp = /(\d+)\.(\d+)\.(\d+)($|\-)/;
  const match = project.pkg.version.match(versionRegExp);
  if (match === null) {
    throw new Error(`package.json 'version' should match ${versionRegExp}`);
  }
  const major = match[1];
  const minor = match[2];
  const patch = match[3];
  console.log(`current version: ${major}.${minor}.${patch}`);

  const raw = new Date()
    .toISOString()
    .replace(/:|T|\.|-/g, '')
    .slice(0, 8);
  const y = raw.slice(0, 4);
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  const datestamp = `${y}${m}${d}`;
  const newVersion = `${major}.${minor}.${patch}-dev.${datestamp}`;
  console.log(`new version: ${newVersion}`);

  const packageJson = await loadPackageJson(false);
  packageJson.version = newVersion;
  await savePackageJson(packageJson, false);

  const packageLockJson = await loadPackageJson(true);
  packageLockJson.version = newVersion;
  await savePackageJson(packageLockJson, true);
}

run().then(() => {
  console.log(`Done.`);
});
