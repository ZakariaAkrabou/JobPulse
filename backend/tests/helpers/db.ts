import { prisma } from "../../src/config/database.js";

export async function resetDb() {
  await prisma.userSelectedPublisher.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.jobPublisher.deleteMany();
  await prisma.jobApi.deleteMany();

  await prisma.$executeRawUnsafe(`ALTER TABLE roles AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE user_profiles AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE user_job_preferences AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE job_apis AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE job_publishers AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE user_selected_publishers AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE jobs AUTO_INCREMENT = 1`);
}

export async function seedRoles() {
  await prisma.role.createMany({
    data: [{ name: "client" }, { name: "admin" }],
    skipDuplicates: true,
  });
}

export async function getRoleId(name: "client" | "admin"): Promise<bigint> {
  const role = await prisma.role.findUniqueOrThrow({ where: { name } });
  return role.id;
}

