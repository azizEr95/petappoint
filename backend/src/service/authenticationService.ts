import { prisma } from "../singletonPC";
import bcrypt from "bcrypt";
import { AuthenticatedType, PostgresIdType, RoleEnum } from "vetilib-shared/schemas/ZodSchemas";

type LoginCompareType = {
  id: PostgresIdType,
  password: string,
  role: RoleEnum
};

async function findUserAndRole(email: string): Promise<LoginCompareType | null> {
  const query = {
    where: {
      email: email
    },
    select: {
      id: true,
      password: true
    }
  };
  const [person, veterinaryPractice] = await Promise.all([prisma.person.findFirst(query), prisma.veterinaryPractice.findFirst(query)]);
  if (veterinaryPractice) {
    return {...veterinaryPractice, role: "company" };
  }
  else if (person) {
    return {...person, role: "person" };
  } else {
    return null;
  }
}

export async function login(email: string, password: string): Promise<AuthenticatedType | false> {
  const loginCompare = await findUserAndRole(email);
  if (!loginCompare) {
    return false;
  }

  const isValidPassword = await checkPassword(password, loginCompare.password);
  if (!isValidPassword) {
    return false;
  }

  return {
    role: loginCompare.role,
    id: loginCompare.id,
  };
}

async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
