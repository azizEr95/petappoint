import { describe, it, expect } from 'vitest';
import { app } from '../../src/app';
import { supertestWithAuth } from '../helpers/supertestWithAuth';
import { verifyPractice } from '../utils/verifyPractice';
import { email } from 'zod';

describe('Veterinary Practices Router - PUT /:id Integration Tests', () => {

    it('should update practice name, phone and infoEmail successfully', async () => {
        const testVetPractice = await verifyPractice();
        const updateData = {
            id: testVetPractice.id,
            name: "Updated Praxis Name",
            phone: "+49987654321",
            infoEmail: "newinfo@updated.de",
            website: "https://updatedpraxis.de",
            info: "Neue Info",
            email: "testpraxis@info.de",
            address: testVetPractice.address,
        };

        const testee = supertestWithAuth(app)
        const response = await testee.put(`/api/veterinary-practice/${testVetPractice.id}`).send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Praxis Name");
        expect(response.body.phone).toBe("+49987654321");
        expect(response.body.infoEmail).toBe("newinfo@updated.de");
    });

    it('should update address street and city successfully', async () => {
        const testVetPractice = await verifyPractice();

        const updateAddress = {
            id: testVetPractice.address.id,
            street: "Neue Straße 42",
            cityCode: "DEU",
            city: "München",
            longitude: 52.52,
            latitude: 13.405,
            country: testVetPractice.address.country
        }

        const updateData = {
            id: testVetPractice.id,
            name: "TestPraxis",
            phone: "017632",
            email: "testpraxis@info.de",
            infoEmail: "testpraxis@info.de",
            website: null,
            info: null,
            address: updateAddress,
        };

        const testee = supertestWithAuth(app)
        const response = await testee.put(`/api/veterinary-practice/${testVetPractice.id}`).send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.address.street).toBe("Neue Straße 42");
        expect(response.body.address.city).toBe("München");
    });

    it('returns 500 with invalid email', async () => {
        const testVetPractice = await verifyPractice();

        const invalidData = {
            name: "Invalid Email Praxis",
            phone: "017632",
            email: "invalid-email",
            infoEmail: "info@test.de",
            website: null,
            info: null,
            address: testVetPractice.address.id,
        };

        const testee = supertestWithAuth(app)
        const response = await testee.put(`/api/veterinary-practice/${testVetPractice.id}`).send(invalidData);

        expect(response.status).toBe(500);
        expect(response.text).toContain('ZodError'); 
    });

    it('should return 500 when address.id is missing', async () => {
        const testVetPractice = await verifyPractice();

        const invalidAddress = {
            street: "Street",
            cityCode: "DEU",
            city: "Berlin",
            longitude: 1,
            latitude: 1,
            country: testVetPractice.address.country
            // id 
        }
        const noAddressIdData = {
            id: testVetPractice.id,
            name: "TestPraxis",
            phone: "017632",
            email: testVetPractice.email,
            infoEmail: "testpraxis@info.de",
            address: invalidAddress,
        };

        const testee = supertestWithAuth(app)
        const response = await testee
            .put(`/api/veterinary-practice/${testVetPractice.id}`)
            .send(noAddressIdData);

        expect(response.status).toBe(500);
        expect(response.text).toContain('ZodError'); 
    });

    it('should return 500 when practice ID does not exist', async () => {
        const testVetPractice = await verifyPractice();
        const updateData = {
            name: "Non Existing Praxis",
            phone: "017632",
            email: testVetPractice.id,
            infoEmail: "info@test.de",
            website: null,
            info: null,
            address: testVetPractice.address.id,
        };

        const testee = supertestWithAuth(app)
        const response = await testee
            .put('/api/veterinary-practice/999999')
            .send(updateData);

        expect(response.status).toBe(500);
        expect(response.text).toContain('ZodError'); 
    });
});