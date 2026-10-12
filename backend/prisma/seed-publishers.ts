import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const PUBLISHERS = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "ZipRecruiter",
  "Monster",
  "Dice",
  "CareerBuilder",
  "SimplyHired",
  "Snagajob",
  "Talent.com",
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  for (const name of PUBLISHERS) {
    await prisma.jobPublisher.upsert({
      where: { name },
      update: {}, 
      create: {
        name,
        slug: toSlug(name),
        isActive: true,
      
      },
    });
  }
  console.log(`Seeded ${PUBLISHERS.length} publishers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());