import { prisma } from "../../src/config/database.js";

export async function resetDb() {
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.jobSource.deleteMany();
  await prisma.$executeRawUnsafe(`ALTER TABLE roles AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE users AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE user_profiles AUTO_INCREMENT = 1`);
  await prisma.$executeRawUnsafe(`ALTER TABLE job_sources AUTO_INCREMENT = 1`);
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

