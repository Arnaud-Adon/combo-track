import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const predefinedTags = [
  "Combo",
  "Punish",
  "Neutral",
  "Mixup",
  "Defense",
  "Oki",
  "Frame Trap",
  "Anti-Air",
  "Tech",
  "Setup",
  "Pressure",
  "Spacing",
  "Whiff Punish",
  "Counter Hit",
  "Reset",
];

const games: Array<{
  slug: string;
  name: string;
  characters: Array<{ slug: string; name: string }>;
}> = [
  {
    slug: "street-fighter-6",
    name: "Street Fighter 6",
    characters: [
      { slug: "ryu", name: "Ryu" },
      { slug: "ken", name: "Ken" },
      { slug: "chun-li", name: "Chun-Li" },
      { slug: "luke", name: "Luke" },
      { slug: "juri", name: "Juri" },
      { slug: "cammy", name: "Cammy" },
    ],
  },
  {
    slug: "tekken-8",
    name: "Tekken 8",
    characters: [
      { slug: "kazuya", name: "Kazuya" },
      { slug: "jin", name: "Jin" },
      { slug: "king", name: "King" },
      { slug: "nina", name: "Nina" },
      { slug: "paul", name: "Paul" },
      { slug: "law", name: "Law" },
    ],
  },
  {
    slug: "guilty-gear-strive",
    name: "Guilty Gear Strive",
    characters: [
      { slug: "sol", name: "Sol Badguy" },
      { slug: "ky", name: "Ky Kiske" },
      { slug: "may", name: "May" },
      { slug: "axl", name: "Axl Low" },
      { slug: "chipp", name: "Chipp Zanuff" },
      { slug: "potemkin", name: "Potemkin" },
    ],
  },
  {
    slug: "mortal-kombat-1",
    name: "Mortal Kombat 1",
    characters: [
      { slug: "liu-kang", name: "Liu Kang" },
      { slug: "scorpion", name: "Scorpion" },
      { slug: "sub-zero", name: "Sub-Zero" },
      { slug: "johnny-cage", name: "Johnny Cage" },
      { slug: "kitana", name: "Kitana" },
      { slug: "raiden", name: "Raiden" },
    ],
  },
];

async function main() {
  console.log("Starting seed...");

  for (const tagName of predefinedTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }
  console.log(`✓ Seeded ${predefinedTags.length} tags`);

  let gameCount = 0;
  let characterCount = 0;

  for (const game of games) {
    const createdGame = await prisma.game.upsert({
      where: { slug: game.slug },
      update: { name: game.name },
      create: { slug: game.slug, name: game.name },
    });
    gameCount += 1;

    for (const character of game.characters) {
      await prisma.character.upsert({
        where: {
          gameId_slug: { gameId: createdGame.id, slug: character.slug },
        },
        update: { name: character.name },
        create: {
          gameId: createdGame.id,
          slug: character.slug,
          name: character.name,
        },
      });
      characterCount += 1;
    }
  }

  console.log(`✓ Seeded ${gameCount} games and ${characterCount} characters`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
