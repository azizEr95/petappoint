import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

jest.mock("../src/singletonPC.ts", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
