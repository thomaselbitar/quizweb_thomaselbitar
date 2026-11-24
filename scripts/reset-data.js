const path = require('path');
const { writeJsonFile } = require('../utils/helpers');

const games = [
  {
    id: 1,
    title: 'Minecraft',
    studio: 'Mojang Studios',
    price: 29.99,
    stock: 15,
  },
  {
    id: 2,
    title: 'Stardew Valley',
    studio: 'ConcernedApe',
    price: 14.99,
    stock: 20,
  },
  {
    id: 3,
    title: 'Hades',
    studio: 'Supergiant Games',
    price: 19.99,
    stock: 10,
  },
  {
    id: 4,
    title: 'Elden Ring',
    studio: 'FromSoftware',
    price: 59.99,
    stock: 8,
  },
  {
    id: 5,
    title: 'Celeste',
    studio: 'Maddy Makes Games',
    price: 24.99,
    stock: 12,
  },
];

async function main() {
  const filePath = path.join(__dirname, '..', 'data', 'games.json');
  await writeJsonFile(filePath, games);
  console.log('data/games.json reset to the 5 starting games.');
}

main().catch((err) => {
  console.error('Failed to reset games:', err.message);
  process.exit(1);
});
