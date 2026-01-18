import { addressService } from "../src/service/addressService";
import { test, expect, beforeEach } from 'vitest';
import { countryService } from "../src/service/countryService";
import { CountryType } from "vetilib-shared/schemas/ZodSchemas";

let testCountry: CountryType;

beforeEach(async () => {
  testCountry = await countryService.create({
    code: "DEU",
    name: "Deutschland",
  });
})

test("test 1", async () => {
  const created = await addressService.create({
    street: "Knobelsdorffstrasse 105",
    cityCode: "DE",
    city: "Berlin",
    country: testCountry.id,
    longitude: 1,
    latitude: 1,
  })
  const getAdress = await addressService.getById(created.id);
  expect(getAdress).toStrictEqual(created);
})

test("test 2", async () => {
  const created = await addressService.create({
    street: "Knobelsdorffstrasse 105",
    cityCode: "DE",
    city: "Berlin",
    country: testCountry.id,
    longitude: 1,
    latitude: 1,
  })
  const getAdress = await addressService.getById(created.id);
  expect(getAdress).toStrictEqual(created);
})