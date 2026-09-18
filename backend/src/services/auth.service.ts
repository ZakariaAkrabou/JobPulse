import {prisma} from '../config/database';
import type {RoleName} from '../generated/prisma/enums';
import type {UserModel} from '../generated/prisma/models/User';
import type {CreateUserInput} from '../dto/RegisterDto';


export async function getRoleIdByName(name: RoleName): Promise<bigint> {
    const role = await prisma.role.findUnique({
        where: { name },
    });

    if(!role) {
        throw new Error(`Role with name ${name} not found`);
    }

    return role.id;
}

export async function getRoleNameById(id: bigint): Promise<RoleName | null> {
  const role = await prisma.role.findUnique({
    where: { id },
    select: { name: true },
  });
  return role?.name ?? null;
}


export async function findUserByEmail(email: string): Promise<UserModel | null> {

    return prisma.user.findUnique({
        where: { email },
    });
}

export async function findUserById(id: bigint): Promise<UserModel | null> {

  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByVerificationToken(token: string): Promise<UserModel | null> {
    return prisma.user.findFirst({
        where: {verificationToken: token},
    });
}


export async function createClientUser(input: CreateUserInput): Promise<UserModel> {

  const clientRoleId = await getRoleIdByName("client");

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
      fullName: input.fullName,
      roleId: clientRoleId,
      isVerified: false,
      verificationToken: input.verificationToken,
      verificationTokenExpiresAt: input.verificationTokenExpiresAt,
    },
  });
}

export async function markUserVerified(userId: bigint): Promise<UserModel> {
    return prisma.user.update({
        where: { id: userId },
        data: { 
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiresAt: null,               
         },
    });
}


export async function setRefreshToken(userId: bigint, token: string, expiresAt: Date): Promise<UserModel> {

    return prisma.user.update({
        where:{id:userId},
        data:{
            refreshToken: token,
            refreshTokenExpiresAt: expiresAt,
        },
    });
}


export async function clearRefreshToken(userId: bigint): Promise<void> {
    await prisma.user.update({
        where: { id: userId },
        data:{
            refreshToken: null,
            refreshTokenExpiresAt: null,
        }
    })
}


export async function setResetPasswordToken(
  userId: bigint,
  token: string,
  expiresAt: Date,
): Promise<UserModel> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: expiresAt,
    },
  });
}

export async function findUserByResetToken(token: string): Promise<UserModel | null> {
  return prisma.user.findFirst({
    where: { resetPasswordToken: token },
  });
}

export async function updateUserPassword(
  userId: bigint,
  passwordHash: string,
): Promise<UserModel> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
      refreshToken: null,
      refreshTokenExpiresAt: null,
    },
  });
}