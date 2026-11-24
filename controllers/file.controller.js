const path = require('path');
const fileHandler = require('../utils/fileHandler');

// This controller only touches data/items.json.
// Request bodies cannot choose a filesystem path.
const ITEMS_FILE = path.join(__dirname, '..', 'data', 'items.json');

async function readItems(req, res, next) {
  try {
    const data = await fileHandler.readJSON(ITEMS_FILE);
    res.json(data ?? []);
  } catch (err) {
    next(err);
  }
}

async function writeItems(req, res, next) {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'body must be a JSON array',
      });
    }

    await fileHandler.writeJSON(ITEMS_FILE, req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
}

async function appendItem(req, res, next) {
  try {
    if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'body must be a JSON object',
      });
    }

    // Read, push, and write so items.json stays a valid JSON array.
    // appendToFile() is for plain text and would corrupt this file.
    const current = await fileHandler.readJSON(ITEMS_FILE);
    if (current !== null && !Array.isArray(current)) {
      return res.status(500).json({
        error: 'Invalid file',
        message: 'data/items.json must contain a JSON array',
      });
    }

    const items = current ?? [];
    items.push(req.body);
    await fileHandler.writeJSON(ITEMS_FILE, items);
    res.status(201).json(items);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  readItems,
  writeItems,
  appendItem,
};
