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

async function main() {
  console.log("Starting seed...");

  for (const tagName of predefinedTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }

  console.log(`✓ Seeded ${predefinedTags.length} tags successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
