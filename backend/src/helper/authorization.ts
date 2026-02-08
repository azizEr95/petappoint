import { prisma } from "../../src/singletonPC";
import { AuthorizationError } from "../exceptions/errors/AuthorizationError";
import { animalService } from "../service/animalService";
import { Request } from "express";

async function ensureCompanyCanAccessAnimal(companyId: number, animalId: number) {
  const hasAccess = await animalService.canCompanyAccessAnimal(companyId, animalId);

  if (!hasAccess) {
    throw new AuthorizationError("No access");
  }
}

async function ensureUserCanAccessAnimal(personId: number, animalId: number) {
  const hasAccess = await animalService.canPersonAccessAnimal(personId, animalId);

  if (!hasAccess) {
    throw new AuthorizationError("No access");
  }
}

export async function ensureCallerHasAccess(req: Request, animalId: number) {
  switch (req.role) {
    case 'person':
      await ensureUserCanAccessAnimal(req.userId!, animalId);
      break;
    case 'company':
      await ensureCompanyCanAccessAnimal(req.userId!, animalId);
      break;
    default: throw new AuthorizationError("User is not authorized.");
  }
}