import { prisma } from "../../src/config/database.js";
import { hashPassword } from "../../src/utils/hash.js";
import { signAccessToken } from "../../src/utils/token.js";

export async function createTestUser(
  overrides: { email?: string; role?: "client" | "admin" } = {},
) {
  const email = overrides.email ?? "test@example.com";
  const roleName = overrides.role ?? "client";

  const role = await prisma.role.findUniqueOrThrow({
    where: { name: roleName },
  });

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword("testpassword123"),
      fullName: "Test User",
      roleId: role.id,
      isVerified: true,
    },
  });

  const token = signAccessToken({
    sub: user.id.toString(),
    role: roleName,
  });

  return { user, token, userId: user.id.toString() };
}