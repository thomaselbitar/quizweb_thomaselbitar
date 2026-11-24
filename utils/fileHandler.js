const fs = require('fs/promises');
const path = require('path');

function resolvePath(filePath) {
  return path.resolve(filePath);
}

async function readFile(filePath) {
  const resolved = resolvePath(filePath);

  try {
    return await fs.readFile(resolved, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

async function writeFile(filePath, data) {
  const resolved = resolvePath(filePath);
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, data, 'utf8');
}

async function readJSON(filePath) {
  const text = await readFile(filePath);
  if (text === null) {
    return null;
  }
  return JSON.parse(text);
}

async function writeJSON(filePath, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(filePath, text);
}

async function appendToFile(filePath, data) {
  const resolved = resolvePath(filePath);
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  const text = typeof data === 'string' ? data : `${JSON.stringify(data)}\n`;
  await fs.appendFile(resolved, text, 'utf8');
}

module.exports = {
  readFile,
  writeFile,
  readJSON,
  writeJSON,
  appendToFile,
};
