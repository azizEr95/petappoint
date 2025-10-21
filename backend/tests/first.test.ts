import { Prisma, sexes } from '../generated/prisma'
import { prismaMock } from '../testConfig/singleton'


let createdAdresse: {
  id: number;
  street: string;
  citycode: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
}

beforeAll(async () => {
  createdAdresse = {
    id: 1,
    street: "Lesser-Ury-Weg 27",
    citycode: "10557",
    city: "Berlin",
    country: "Germany",
    longitude: 0.0,
    latitude: 0.0
  }
})
test('should create address and person', async () => {
  
  const createdPerson = {
    id: 1,
    firstname: 'Aziz',
    lastname: 'Erol',
    sex: sexes.male,
    dateofbirth: new Date("December 17, 1995 03:24:00"),
    phone: '015759712682',
    email: 'beba3606@bht-berlin.de',
    password: '123',
    fk_address: createdAdresse.id
  }

  prismaMock.addresses.create.mockResolvedValue(createdAdresse)
  prismaMock.persons.create.mockResolvedValue(createdPerson)

  await expect(prismaMock.addresses.create({
    data: {
      street: "Lesser-Ury-Weg 27",
      citycode: "10557",
      city: "Berlin",
      country: "Germany",
      latitude: 0.0,
      longitude: 0.0
    }
  })).resolves.toEqual(createdAdresse)

  await expect(prismaMock.persons.create({
    data: {
      firstname: 'Aziz',
      lastname: 'Erol',
      sex: 'male',
      dateofbirth: new Date("December 17, 1995 03:24:00"),
      phone: '015759712682',
      email: 'beba3606@bht-berlin.de',
      password: '123',
      fk_address: createdAdresse.id
    }
  })).resolves.toEqual(createdPerson)
})

test('should find person by id', async () => {
  const person = [{
    id: 1,
    firstname: 'Aziz',
    lastname: 'Erol',
    sex: sexes.male,
    dateofbirth: new Date("December 17, 1995 03:24:00"),
    phone: '015759712682',
    email: 'beba3606@bht-berlin.de',
    password: '123',
    fk_address: createdAdresse.id
  }]

  prismaMock.persons.findMany.mockResolvedValue(person)

  await expect(prismaMock.persons.findMany({
    where: { id: 1 }
  })).resolves.toEqual(person)
})

test('should delete person by id', async () => {
  const deletedPerson = {
    id: 1,
    firstname: 'Aziz',
    lastname: 'Erol',
    sex: sexes.male,
    dateofbirth: new Date("December 17, 1995 03:24:00"),
    phone: '015759712682',
    email: 'beba3606@bht-berlin.de',
    password: '123',
    fk_address: createdAdresse.id
  }

  prismaMock.persons.delete.mockResolvedValue(deletedPerson)

  await expect(prismaMock.persons.delete({
    where: { id: 1 }
  })).resolves.toEqual(deletedPerson)
})

test('should find all tieraerzte', async () => {
  const tierAerzte = [{
    id: 1,
    infoemail: 'dr.mueller@tierarzt.de',
    fk_veterinarypractice: 1
  }]

  prismaMock.veterinaries.findMany.mockResolvedValue(tierAerzte)

  await expect(prismaMock.veterinaries.findMany()).resolves.toEqual(tierAerzte)
})

test('should create tierarztpraxis', async () => {
  const tierarztpraxis = {
    id: 1,
    name: 'Tierarztpraxis Mitte',
    phone: '030123456',
    infoemail: 'info@praxis.de',
    email: 'kontakt@praxis.de',
    password: 'hashedpassword',
    website: 'www.praxis.de',
    info: 'Beste Praxis in Berlin',
    fk_addressid: createdAdresse.id
  }

  prismaMock.veterinarypractices.create.mockResolvedValue(tierarztpraxis)

  await expect(prismaMock.veterinarypractices.create({
    data: {
      name: 'Tierarztpraxis Mitte',
      phone: '030123456',
      infoemail: 'info@praxis.de',
      email: 'kontakt@praxis.de',
      password: 'hashedpassword',
      website: 'www.praxis.de',
      info: 'Beste Praxis in Berlin',
      fk_addressid: createdAdresse.id
    }
  })).resolves.toEqual(tierarztpraxis)
})

test('should create tier', async () => {
  const tier = {
    id: 1,
    name: 'Bello',
    dateofbirth: new Date('2020-05-15'),
    fk_animaltypeid: 1
  }

  prismaMock.animals.create.mockResolvedValue(tier)

  await expect(prismaMock.animals.create({
    data: {
      name: 'Bello',
      dateofbirth: new Date('2020-05-15'),
      fk_animaltypeid: 1
    }
  })).resolves.toEqual(tier)
})