import { prisma } from "../../src/config/database.js";

export async function resetDb() {
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
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