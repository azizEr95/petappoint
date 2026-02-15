import { PersonHasAnimal } from "../../generated/prisma"
import PetsOwnerships from "src/models/PetsOwnerships"

export const personHasAnimalService = {
  async create(data: PersonHasAnimal): Promise<PersonHasAnimal> {
    return await PetsOwnerships.create(data)
  },

  async getAnimalsByPersonId(personId: number) {
    return await PetsOwnerships.getAnimalsByPersonId(personId)
  },

  async getPersonsByAnimalId(animalId: number) {
    return await PetsOwnerships.getPersonsByAnimalId(animalId)
  },

  async delete(data: PersonHasAnimal): Promise<void> {
    await PetsOwnerships.delete(data)
  },

  async exists(data: PersonHasAnimal): Promise<boolean> {
    return PetsOwnerships.exists(data)
  },
}
