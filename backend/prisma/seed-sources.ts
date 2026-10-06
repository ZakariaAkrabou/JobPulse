import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const SOURCES = [
  {
    name: "JSearch",
    apiEndpoint: "https://jsearch.p.rapidapi.com/search",
    apiKeyEnv: "RAPIDAPI_KEY",
    isActive: true,
  },
  {
    name: "Adzuna",
    apiEndpoint: "https://api.adzuna.com/v1/api/jobs",
    apiKeyEnv: "ADZUNA_APP_ID",
    isActive: true,
  },
  {
    name: "Remotive",
    apiEndpoint: "https://remotive.com/api/remote-jobs",
    apiKeyEnv: "", 
    isActive: true,
  },
  {
    name: "RemoteOK",
    apiEndpoint: "https://remoteok.com/api",
    apiKeyEnv: "", 
    isActive: true,
  },
];

async function main() {
  for (const source of SOURCES) {
    await prisma.jobSource.upsert({
      where: { name: source.name },
      update: source,
      create: source,
    });
  }
  console.log(`Seeded ${SOURCES.length} sources.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());