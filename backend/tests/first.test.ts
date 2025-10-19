import { geschlechtenum } from '../generated/prisma'
import { prismaMock } from '../testConfig/singleton'


let createdAdresse: {
  id: number;
  strasse: string;
  citycode: string;
  city: string;
  country: string;
}

beforeAll(async () => {
  createdAdresse = {
    id: 1,
    strasse: "Lesser-Ury-Weg 27",
    citycode: "10557",
    city: "Berlin",
    country: "Germany"
  }
})
test('should create address and person', async () => {
  
  const createdPerson = {
    id: 1,
    vorname: 'Aziz',
    nachname: 'Erol',
    geschlecht: geschlechtenum.m,
    geburtsdatum: new Date("December 17, 1995 03:24:00"),
    telefon: '015759712682',
    email: 'beba3606@bht-berlin.de',
    password: '123',
    addresse: createdAdresse.id
  }

  prismaMock.addressen.create.mockResolvedValue(createdAdresse)
  prismaMock.personen.create.mockResolvedValue(createdPerson)

  await expect(prismaMock.addressen.create({
    data: {
      strasse: "Lesser-Ury-Weg 27",
      citycode: "10557",
      city: "Berlin",
      country: "Germany"
    }
  })).resolves.toEqual(createdAdresse)

  await expect(prismaMock.personen.create({
    data: {
      vorname: 'Aziz',
      nachname: 'Erol',
      geschlecht: geschlechtenum.m,
      geburtsdatum: new Date("December 17, 1995 03:24:00"),
      telefon: '015759712682',
      email: 'beba3606@bht-berlin.de',
      password: '123',
      addresse: createdAdresse.id
    }
  })).resolves.toEqual(createdPerson)
})

test('should find person by id', async () => {
  const person = [{
    id: 1,
    vorname: 'Aziz',
    nachname: 'Erol',
    geschlecht: geschlechtenum.m,
    geburtsdatum: new Date("December 17, 1995 03:24:00"),
    telefon: '015759712682',
    email: 'beba3606@bht-berlin.de',
    password: '123',
    addresse: createdAdresse.id
  }]

  prismaMock.personen.findMany.mockResolvedValue(person)

  await expect(prismaMock.personen.findMany({
    where: { id: 1 }
  })).resolves.toEqual(person)
})

test('should delete person by id', async () => {
  const deletedPerson = {
    id: 1,
    vorname: 'Aziz',
    nachname: 'Erol',
    geschlecht: geschlechtenum.m,
    geburtsdatum: new Date("December 17, 1995 03:24:00"),
    telefon: '015759712682',
    email: 'beba3606@bht-berlin.de',
    password: '123',
    addresse: createdAdresse.id
  }

  prismaMock.personen.delete.mockResolvedValue(deletedPerson)

  await expect(prismaMock.personen.delete({
    where: { id: 1 }
  })).resolves.toEqual(deletedPerson)
})

test('should find all tieraerzte', async () => {
  const tierAerzte = [{
    id: 1,
    infoemail: 'dr.mueller@tierarzt.de',
    fk_tierarztpraxis: 1
  }]

  prismaMock.tieraerzte.findMany.mockResolvedValue(tierAerzte)

  await expect(prismaMock.tieraerzte.findMany()).resolves.toEqual(tierAerzte)
})

test('should create tierarztpraxis', async () => {
  const tierarztpraxis = {
    id: 1,
    name: 'Tierarztpraxis Mitte',
    longitude: 13.404954,
    latitude: 52.520008,
    telefon: '030123456',
    infoemail: 'info@praxis.de',
    email: 'kontakt@praxis.de',
    password: 'hashedpassword',
    website: 'www.praxis.de',
    info: 'Beste Praxis in Berlin',
    fk_addresseid: createdAdresse.id
  }

  prismaMock.tierarztpraxen.create.mockResolvedValue(tierarztpraxis)

  await expect(prismaMock.tierarztpraxen.create({
    data: {
      name: 'Tierarztpraxis Mitte',
      longitude: 13.404954,
      latitude: 52.520008,
      telefon: '030123456',
      infoemail: 'info@praxis.de',
      email: 'kontakt@praxis.de',
      password: 'hashedpassword',
      website: 'www.praxis.de',
      info: 'Beste Praxis in Berlin',
      fk_addresseid: createdAdresse.id
    }
  })).resolves.toEqual(tierarztpraxis)
})

test('should create tier', async () => {
  const tier = {
    id: 1,
    name: 'Bello',
    geburtsdatum: new Date('2020-05-15'),
    fk_tierartid: 1
  }

  prismaMock.tiere.create.mockResolvedValue(tier)

  await expect(prismaMock.tiere.create({
    data: {
      name: 'Bello',
      geburtsdatum: new Date('2020-05-15'),
      fk_tierartid: 1
    }
  })).resolves.toEqual(tier)
})