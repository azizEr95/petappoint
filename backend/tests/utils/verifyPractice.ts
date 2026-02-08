import { addressService } from "../../src/service/addressService";
import { countryService } from "../../src/service/countryService";
import { veterinaryPracticeService } from "../../src/service/veterinaryPracticeService";
import { prisma } from "../../src/singletonPC";
import { performAuthentication } from "../helpers/supertestWithAuth";

export async function verifyPractice() {
    const testCountry = await countryService.create({
            code: "DEU",
            name: "Deutschland",
        });
    
        const testAddress = await addressService.create({
            street: "Knobelsdorffstrasse 105",
            cityCode: "DEU",
            city: "Berlin",
            country: testCountry.id,
            longitude: 1,
            latitude: 1,
        });
    
        const testVetPractice = await veterinaryPracticeService.create({
            name: "TestPraxis",
            phone: "017632",
            email: "test@test.de",
            infoEmail: "testpraxis@info.de",
            website: null,
            info: null,
            address: testAddress,
            password: "Passwort123!"
        });
    
        // Confirmation-Code mit verified=true
        await prisma.veterinarypractices_has_confirmation_code.create({
            data: {
                fk_veterinarypracticeid: testVetPractice.id,
                code: 'TEST12',
                dateofcreation: new Date(),
                verified: true
            }
        });
    
        await performAuthentication(testVetPractice.email, 'Passwort123!');
    
        await prisma.veterinarypractices_has_confirmation_code.update({
            where: { fk_veterinarypracticeid: testVetPractice.id },
            data: { verified: true }
        });

        return testVetPractice
}