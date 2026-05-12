import { beforeEach, describe, expect, it } from "vitest";
import { addressService } from "../../src/service/addressService";
import { ResourceNotFoundError } from "../../src/exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../../src/exceptions/errors/ConstraintError";
import { AddressesCreateType, CountryType } from "petappoint-shared/schemas/ZodSchemas";
import { countryService } from "../../src/service/countryService";

describe("adressService CRUD Functions", () => {
    let testCountry: CountryType;
    let testAddress: AddressesCreateType;

    beforeEach(async () => {
        testCountry = await countryService.create({
            code: "DEU",
            name: "Deutschland",
        });
        testAddress = {
            street: "Knobelsdorffstrasse 105",
            cityCode: "DE",
            city: "Berlin",
            country: testCountry.id,
            longitude: 1,
            latitude: 1,
        }
    })
    it("create an address", async () => {
        const createdAddress = await addressService.create(testAddress);
        const getAdress = await addressService.getById(createdAddress.id);
        expect(getAdress).toStrictEqual(createdAddress);
    });

    it("address getById", async () => {
        const createdAddress = await addressService.create(testAddress);

        const getAdressById = await addressService.getById(createdAddress.id);
        expect(getAdressById).toStrictEqual(createdAddress);
    });


    it("address getAll", async () => {
        const createAddress = await addressService.create(testAddress);

        await addressService.create({
            street: "Kaiserdamm 38",
            cityCode: "DE",
            city: "Berlin",
            country: testCountry.id,
            longitude: 1,
            latitude: 1,
        });

        await addressService.create({
            street: "Reclamweg 2",
            cityCode: "DE",
            city: "Berlin",
            country: testCountry.id,
            longitude: 1,
            latitude: 1,
        });

        const getAllAddresses = await addressService.getAll();
        expect(getAllAddresses).toHaveLength(3);
        expect(getAllAddresses[0]).toStrictEqual(createAddress);
    });

    it("update address throws ConstraintError on missing id", async () => {
        await addressService.create(testAddress);

        await expect(addressService.update({
            id: undefined as any,
            street: "Washingtonstreet 38",
            cityCode: "US",
            city: "Washington",
            country: testCountry.id,
            longitude: 95,
            latitude: 95,
        })).rejects.toThrow(ConstraintError);
    });

    it("update address", async () => {
        const createdAddress = await addressService.create(testAddress);

        const updatedAddress = await addressService.update({
            id: createdAddress.id,
            street: "Washingtonstreet 38",
            cityCode: "US",
            city: "Washington",
            country: testCountry.id,
            longitude: 95,
            latitude: 95,
        })
        expect(updatedAddress.street).toBe("Washingtonstreet 38");
        expect(updatedAddress.cityCode).toBe("US");
        expect(updatedAddress.city).toBe("Washington");
        expect(updatedAddress.longitude).toBe(95);
        expect(updatedAddress.latitude).toBe(95);
    });

    it("Delete an address", async () => {
        const createdAddress = await addressService.create(testAddress);

        await addressService.delete(createdAddress.id);
        await expect(addressService.getById(createdAddress.id)).rejects.toThrow(ResourceNotFoundError);
    })
})