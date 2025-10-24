import { prisma } from "../singletonPC";
import { VeterinaryPracticeResource } from "src/Resource";

export const veterinaryPracticeService = {
  // Create
  async create(
    data: VeterinaryPracticeResource
  ): Promise<VeterinaryPracticeResource> {
    const createdPractice = await prisma.veterinarypractices.create({
      data: {
        name: data.name,
        phone: data.phone,
        infoemail: data.infoEmail,
        email: data.email,
        password: data.password,
        website: data.website,
        info: data.info,
        fk_addressid: data.addressId,
      },
    });

    return mapVeterinaryPracticeToResource(createdPractice);
  },

  // Read by ID
  async getById(id: number): Promise<VeterinaryPracticeResource> {
    const foundPractice = await prisma.veterinarypractices.findUnique({
      where: { id },
      include: {
        addresses: true,
        veterinaries: true,
      },
    });

    if (!foundPractice) {
      throw new Error(`Veterinary Practice not found with id: ${id}`);
    }

    return mapVeterinaryPracticeToResource(foundPractice);
  },

  // Update
  async update(
    data: VeterinaryPracticeResource
  ): Promise<VeterinaryPracticeResource> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updatedPractice = await prisma.veterinarypractices.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone: data.phone,
        infoemail: data.infoEmail,
        email: data.email,
        password: data.password,
        website: data.website,
        info: data.info,
        fk_addressid: data.addressId,
      },
    });

    return mapVeterinaryPracticeToResource(updatedPractice);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.veterinarypractices.delete({
      where: { id },
    });
  },

  // List all veterinary practices
  async getAll(): Promise<VeterinaryPracticeResource[]> {
    const practices = await prisma.veterinarypractices.findMany({
      include: {
        addresses: true,
        veterinaries: true,
      },
    });
    return practices.map(mapVeterinaryPracticeToResource);
  },

  // Find by email
  async getByEmail(email: string): Promise<VeterinaryPracticeResource | null> {
    const practice = await prisma.veterinarypractices.findFirst({
      where: { email },
    });

    return practice ? mapVeterinaryPracticeToResource(practice) : null;
  },

  // Find practices by address
  async getByAddress(addressId: number): Promise<VeterinaryPracticeResource[]> {
    const practices = await prisma.veterinarypractices.findMany({
      where: { fk_addressid: addressId },
      include: {
        addresses: true,
      },
    });

    return practices.map(mapVeterinaryPracticeToResource);
  },
};

// Helper function to map Prisma veterinarypractices to resource
function mapVeterinaryPracticeToResource(
  practice: any
): VeterinaryPracticeResource {
  return {
    id: practice.id,
    name: practice.name,
    phone: practice.phone,
    infoEmail: practice.infoemail,
    email: practice.email,
    password: practice.password,
    website: practice.website,
    info: practice.info,
    addressId: practice.fk_addressid,
  };
}
