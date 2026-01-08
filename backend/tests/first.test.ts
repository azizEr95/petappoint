import { addressService } from "../src/service/addressService";
import { test, expect } from 'vitest';

test("test 1",async () => {
  const created = await addressService.create({
    street: "Knobelsdorffstrasse 105",
    cityCode: "DE",
    city: "Berlin",
    country: "Deutschland",
    longitude: 1,
    latitude: 1,
  })
  const getAdress = await addressService.getById(created.id);
  expect(getAdress).toStrictEqual(created);
})

test("test 2",async () => {
  const created = await addressService.create({
    street: "Knobelsdorffstrasse 105",
    cityCode: "DE",
    city: "Berlin",
    country: "Deutschland",
    longitude: 1,
    latitude: 1,
  })
  const getAdress = await addressService.getById(created.id);
  expect(getAdress).toStrictEqual(created);
})