const fs = require('fs/promises');

async function readJsonFile(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

async function writeJsonFile(filePath, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(filePath, text, 'utf8');
}

module.exports = {
  readJsonFile,
  writeJsonFile,
};
