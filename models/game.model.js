const path = require('path');
const { readJsonFile, writeJsonFile } = require('../utils/helpers');

const filePath = path.join(__dirname, '..', 'data', 'games.json');

async function readGames() {
  const games = await readJsonFile(filePath);
  return Array.isArray(games) ? games : [];
}

function filterGames(games, filters = {}) {
  return games.filter((game) => {
    if (filters.minPrice !== undefined && Number(game.price) < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && Number(game.price) > filters.maxPrice) {
      return false;
    }
    return true;
  });
}

function sortGames(games, sortBy, order) {
  const direction = order === 'desc' ? -1 : 1;

  return [...games].sort((a, b) => {
    if (sortBy === 'title') {
      return String(a.title).localeCompare(String(b.title)) * direction;
    }

    return (Number(a[sortBy]) - Number(b[sortBy])) * direction;
  });
}

async function getAll(filters, listOptions = {}) {
  const games = await readGames();
  const filtered = filterGames(games, filters);
  const sortBy = listOptions.sortBy || 'id';
  const order = listOptions.order || 'asc';
  return sortGames(filtered, sortBy, order);
}

async function getById(id) {
  const games = await readGames();
  return games.find((game) => game.id === id) || null;
}

async function create(fields) {
  const games = await readGames();
  const id = games.reduce((max, game) => Math.max(max, Number(game.id)), 0) + 1;
  const game = { ...fields, id };
  games.push(game);
  await writeJsonFile(filePath, games);
  return game;
}

async function replace(id, fields) {
  const games = await readGames();
  const index = games.findIndex((game) => game.id === id);

  if (index === -1) {
    return null;
  }

  const game = { ...fields, id };
  games[index] = game;
  await writeJsonFile(filePath, games);
  return game;
}

async function update(id, changes) {
  const games = await readGames();
  const index = games.findIndex((game) => game.id === id);

  if (index === -1) {
    return null;
  }

  const game = { ...games[index], ...changes, id };
  games[index] = game;
  await writeJsonFile(filePath, games);
  return game;
}

async function remove(id) {
  const games = await readGames();
  const index = games.findIndex((game) => game.id === id);

  if (index === -1) {
    return false;
  }

  games.splice(index, 1);
  await writeJsonFile(filePath, games);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  replace,
  update,
  remove,
};
