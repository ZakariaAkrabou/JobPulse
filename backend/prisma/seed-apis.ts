import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const APIS = [
  {
    code: "jsearch",
    name: "JSearch",
    apiEndpoint: "https://jsearch.p.rapidapi.com/search-v2",
    apiKeyEnv: "JSEARCH_KEY",
    isActive: true,
  },
  {
    code: "adzuna",
    name: "Adzuna",
    apiEndpoint: "https://api.adzuna.com/v1/api/jobs",
    apiKeyEnv: "ADZUNA_APP_ID",
    isActive: true,
  },
  {
    code: "remotive",
    name: "Remotive",
    apiEndpoint: "https://remotive.com/api/remote-jobs",
    apiKeyEnv: "",
    isActive: true,
  },
  {
    code: "remoteok",
    name: "RemoteOK",
    apiEndpoint: "https://remoteok.com/api",
    apiKeyEnv: "",
    isActive: true,
  },
];

async function main() {
  for (const api of APIS) {
    await prisma.jobApi.upsert({
      where: { code: api.code },
      update: api,
      create: api,
    });
    console.log(`✓ ${api.name}`);
  }
  console.log(`Seeded ${APIS.length} APIs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());