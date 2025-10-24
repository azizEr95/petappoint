import { prisma } from "../singletonPC";
import { PersonResource } from "src/Resource";

export const personService = {
  // Create
  async create(data: PersonResource): Promise<PersonResource> {
    const createdPerson = await prisma.persons.create({
      data: {
        firstname: data.firstName,
        lastname: data.lastName,
        sex: data.sex,
        dateofbirth: data.dateOfBirth,
        fk_address: data.addressId,
        phone: data.phone,
        email: data.email,
        password: data.password,
      },
    });

    return mapPersonToResource(createdPerson);
  },

  // Read by ID
  async getById(id: number): Promise<PersonResource> {
    const foundPerson = await prisma.persons.findUnique({
      where: { id },
      include: {
        addresses: true,
        person_has_animal: true,
      },
    });

    if (!foundPerson) {
      throw new Error(`Person not found with id: ${id}`);
    }

    return mapPersonToResource(foundPerson);
  },

  // Update
  async update(data: PersonResource): Promise<PersonResource> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updatedPerson = await prisma.persons.update({
      where: { id: data.id },
      data: {
        firstname: data.firstName,
        lastname: data.lastName,
        sex: data.sex,
        dateofbirth: data.dateOfBirth,
        fk_address: data.addressId,
        phone: data.phone,
        email: data.email,
        password: data.password,
      },
    });

    return mapPersonToResource(updatedPerson);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.persons.delete({
      where: { id },
    });
  },

  // List all persons
  async getAll(): Promise<PersonResource[]> {
    const persons = await prisma.persons.findMany({
      include: {
        addresses: true,
        person_has_animal: true,
      },
    });
    return persons.map(mapPersonToResource);
  },

  // Find by email
  async getByEmail(email: string): Promise<PersonResource | null> {
    const person = await prisma.persons.findUnique({
      where: { email },
    });

    return person ? mapPersonToResource(person) : null;
  },
};

// Helper function to map Prisma persons to resource
function mapPersonToResource(person: any): PersonResource {
  return {
    id: person.id,
    firstName: person.firstname,
    lastName: person.lastname,
    sex: person.sex,
    dateOfBirth: person.dateofbirth,
    addressId: person.fk_address,
    phone: person.phone,
    email: person.email,
    password: person.password,
  };
}
