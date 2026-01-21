import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { personService } from '../../src/service/personService'
import { AddressesCreateType, CountryType, PersonsType, VeterinaryPracticesType } from 'vetilib-shared/schemas/ZodSchemas';
import { countryService } from '../../src/service/countryService';
import { veterinaryPracticeService } from '../../src/service/veterinaryPracticeService';
import { veterinaryService } from '../../src/service/veterinaryService';

describe('Veterinarians Router - Integration Tests', () => {
    let testCountry: CountryType;
    let testAddress: AddressesCreateType;
    let testPersonForVet: PersonsType;
    let testVetPractice: VeterinaryPracticesType

    beforeEach(async () => {
        testCountry = await countryService.create({
            code: "DEU",
            name: "Deutschland",
        });

        testAddress = {
            street: "Knobelsdorffstrasse 105",
            cityCode: "DEU",
            city: "Berlin",
            country: testCountry.id,
            longitude: 1,
            latitude: 1,
        };

        testVetPractice = await veterinaryPracticeService.create({
            name: "TestPraxis",
            phone: "017632",
            email: "testpraxis@info.de",
            infoEmail: "testpraxis@info.de",
            website: null,
            info: null,
            address: testAddress,
            password: "Passwort123!"
        });
    })

    it('should create a veterinarian when person exist', async () => {
        testPersonForVet = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "max",
            lastName: "mustermann",
            phone: "1234567789",
            email: "testee@test.de",
            address: testAddress,
            password: "BingoBingo9993!"
        });
        const foundPerson = await personService.getByEmail(testPersonForVet.email)
        expect(foundPerson).toStrictEqual(testPersonForVet);

        const response = await request(app)
            .post('/api/veterinarians')
            .send({
                email: 'testee@test.de',
                firstName: 'max',
                lastName: 'mustermann',
                sex: 'male',
                dateOfBirth: new Date(),
                password: "passwort",
                phone: '123456789',
                address: testAddress,
                infoEmail: 'info@clinic.de',
                veterinaryPracticeId: testVetPractice.id,
            });

        expect(response.status).toBe(201);
    });

    it('should create veterinarian when person does not exists', async () => {

        const vetData = {
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "Müller",
            lastName: "Müll",
            phone: "1234567789",
            email: "muerller@test.de",
            address: {
                street: "Knobelsdorffstrasse 100",
                cityCode: "DEU",
                city: "Berlin",
                country: testCountry.id,
                longitude: 3,
                latitude: 3,
            },
            password: "BingoBingo9994!",
            veterinaryPracticeId: testVetPractice.id,
        }

        const response = await request(app)
            .post('/api/veterinarians')
            .send(vetData);

        expect(response.status).toBe(201);
        expect(response.body.firstName).toBe("Müller")
    });

        it('should return 400 when email is invalid', async () => {
        const vetData = {
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "Müller",
            lastName: "Müll",
            phone: "1234567789",
            email: null,
            address: {
                street: "Knobelsdorffstrasse 100",
                cityCode: "DEU",
                city: "Berlin",
                country: testCountry.id,
                longitude: 3,
                latitude: 3,
            },
            password: "BingoBingo9994!",
            veterinaryPracticeId: testVetPractice.id,
        }

        const response = await request(app)
            .post('/api/veterinarians')
            .send(vetData);

        expect(response.status).toBe(400);
    });

    it('should return 500 when veterinary service fails', async () => {
        testPersonForVet = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "max",
            lastName: "mustermann",
            phone: "1234567789",
            email: "testee@test.de",
            address: testAddress,
            password: "BingoBingo9993!"
        });
        const foundPerson = await personService.getByEmail(testPersonForVet.email)
        expect(foundPerson).toStrictEqual(testPersonForVet);

        const response = await request(app)
            .post('/api/veterinarians')
            .send({
                email: 'testee@test.de',
                firstName: 'max',
                lastName: 'mustermann',
                sex: 'male',
                dateOfBirth: new Date(),
                password: "passwort",
                phone: '123456789',
                address: testAddress,
                infoEmail: 'info@clinic.de',
                veterinaryPracticeId: testVetPractice.id,
            });

        expect(response.status).toBe(201);

        const secondResponse = await request(app)
            .post('/api/veterinarians')
            .send({
                email: 'testee@test.de',
                firstName: 'max',
                lastName: 'mustermann',
                sex: 'male',
                dateOfBirth: new Date(),
                password: "passwort",
                phone: '123456789',
                address: testAddress,
                infoEmail: 'info@clinic.de',
                veterinaryPracticeId: testVetPractice.id,
            });

        expect(secondResponse.status).toBe(500);
    });

    it('should return 500 when validation schema fails', async () => {
        const vetData = {
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "M",
            lastName: "Müll",
            phone: "1234567789",
            email: "muerller@test.de",
            address: {
                street: "Knobelsdorffstrasse 100",
                cityCode: "DEU",
                city: "Berlin",
                country: testCountry.id,
                longitude: 3,
                latitude: 3,
            },
            password: "BingoBingo9994!",
            veterinaryPracticeId: testVetPractice.id,
        }

        const response = await request(app)
            .post('/api/veterinarians')
            .send(vetData);

        expect(response.status).toBe(500);
    });

    it('should return 500 when missing required fields', async () => {
        const vetData = {
            sex: "male",
            dateOfBirth: new Date(),
            //firstName: "M",
            //lastName: "Müll",
            phone: "1234567789",
            email: "muerller@test.de",
            address: {
                street: "Knobelsdorffstrasse 100",
                cityCode: "DEU",
                city: "Berlin",
                country: testCountry.id,
                longitude: 3,
                latitude: 3,
            },
            password: "BingoBingo9994!",
            //veterinaryPracticeId: testVetPractice.id,
        }

        const response = await request(app)
            .post('/api/veterinarians')
            .send(vetData);

        expect(response.status).toBe(500);
    });
});