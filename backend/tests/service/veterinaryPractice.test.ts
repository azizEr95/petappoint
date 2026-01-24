import { beforeEach, describe, expect, it } from "vitest";
import { appointmentService } from "../../src/service/appointmentService";
import { veterinaryService } from "../../src/service/veterinaryService";
import { veterinaryPracticeService } from "../../src/service/veterinaryPracticeService";
import { personService } from "../../src/service/personService";
import { serviceService } from "../../src/service/serviceService";
import { animalService } from "../../src/service/animalService";
import { animalTypeService } from "../../src/service/animalTypeService";
import { CountryType } from "vetilib-shared/schemas/ZodSchemas";
import { countryService } from "../../src/service/countryService";

describe("veterinaryPracticeService Function", () => {
    let testCountry: CountryType;

    beforeEach(async () => {
        testCountry = await countryService.create({
            code: "DEU",
            name: "Deutschland",
        });
    });
    
    it("getAnimalWithPerson", async () => {
        const startTime = new Date("2026-01-16T09:00:00Z");
        const endTime = new Date("2026-01-16T09:30:00Z");

        const testService = await serviceService.create({
            name: "Impfung",
            id: 3242423,
        });

        const testVetPractice = await veterinaryPracticeService.create({
            name: "TestPraxis",
            phone: "017632",
            email: "testpraxis@info.de",
            infoEmail: "testpraxis@info.de",
            website: null,
            info: null,
            address: {
                street: "Knobelsdorffstrasse 105",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 1,
                latitude: 1,
            },
            password: "Passwort123!"
        });

        const testPersonForVet = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "max",
            lastName: "mustermann",
            phone: "1234567789",
            email: "testee@test.de",
            address: {
                street: "Knobelsdorffstrasse 99",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 2,
                latitude: 2,
            },
            password: "BingoBingo9993!"
        });

        const testVet = await veterinaryService.create({
            id: testPersonForVet.id,
            firstName: testPersonForVet.firstName,
            lastName: testPersonForVet.lastName,
            infoEmail: "vet@info.de",
            fk_veterinarypracticeid: testVetPractice.id
        });

        const testPerson2 = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "Axel",
            lastName: "Schulz",
            phone: "1234567789",
            email: "testee2@test.de",
            address: {
                street: "Knobelsdorffstrasse 100",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 3,
                latitude: 3,
            },
            password: "BingoBingo9994!"
        });

        const testAnimalType = await animalTypeService.create({
            id: 9345,
            name: "Hund",
        })

        const testAnimal = await animalService.create({
            name: "Bello",
            lifestyle: "indoor",
            sex: "not_known",
            dateOfBirth: new Date(),
            dateOfBirthIsExact: true,
            weightInGram: null,
            heightInCm: null,
            timeOfDeath: null,
            isCastrated: true,
            animalTypeId: testAnimalType.id,
        })

        const testAppointment = {
            startTime: startTime,
            endTime: endTime,
            veterinaryId: testVet.id,
            fk_veterinarypracticeid: testVetPractice.id,
            availableServiceIds: [testService.id],
        }

        const appointment = await appointmentService.create(testAppointment);
        let getAppointment = await appointmentService.getById(appointment.id);
        expect(getAppointment).toStrictEqual(appointment);

        await appointmentService.updateAppointmentAsPerson(
            getAppointment.id,
            testAnimal.id,
            testService.id,
        );

        getAppointment = await appointmentService.getById(appointment.id);
        expect(getAppointment.service?.name).toBe("Impfung");
        expect(getAppointment.animal?.name).toBe("Bello");
        expect(getAppointment.animal?.name).toBe("Bello");
        expect(getAppointment.veterinaryPractice.name).toBe("TestPraxis");

        await personService.connectAnimal(testPerson2.id, testAnimal.id)

        const animalAndPersons = await veterinaryPracticeService.getAnimalWithPerson(testVetPractice.id);
        expect(animalAndPersons[0]).toStrictEqual({
            animal: testAnimal,
            person: testPerson2
        });
    })

    it("getAnimalWithPerson should return empty array when no appointments exist", async () => {
        const testVetPractice = await veterinaryPracticeService.create({
            name: "EmptyPraxis",
            phone: "017632",
            email: "empty@info.de",
            infoEmail: "empty@info.de",
            website: null,
            info: null,
            address: {
                street: "Knobelsdorffstrasse 105",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 1,
                latitude: 1,
            },
            password: "Passwort123!"
        });

        const animalAndPersons = await veterinaryPracticeService.getAnimalWithPerson(testVetPractice.id);
        expect(animalAndPersons).toEqual([]);
    });

    it("getAnimalWithPerson should return multiple animals with their persons", async () => {
        const testService = await serviceService.create({
            name: "Zahnreinigung",
            id: 9999999,
        });

        const testVetPractice = await veterinaryPracticeService.create({
            name: "MultiPraxis",
            phone: "017632",
            email: "multi@info.de",
            infoEmail: "multi@info.de",
            website: null,
            info: null,
            address: {
                street: "Knobelsdorffstrasse 105",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 1,
                latitude: 1,
            },
            password: "Passwort123!"
        });

        const testPersonForVet = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "max",
            lastName: "mustermann",
            phone: "1234567789",
            email: "testee@test.de",
            address: {
                street: "Knobelsdorffstrasse 99",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 2,
                latitude: 2,
            },
            password: "BingoBingo9993!"
        });

        const testVet = await veterinaryService.create({
            id: testPersonForVet.id,
            firstName: testPersonForVet.firstName,
            lastName: testPersonForVet.lastName,
            infoEmail: "vet@info.de",
            fk_veterinarypracticeid: testVetPractice.id
        });

        // Zwei verschiedene Personen
        const testPerson1 = await personService.create({
            sex: "female",
            dateOfBirth: new Date(),
            firstName: "Anna",
            lastName: "Schmidt",
            phone: "1234567789",
            email: "anna@test.de",
            address: {
                street: "Knobelsdorffstrasse 100",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 3,
                latitude: 3,
            },
            password: "BingoBingo9994!"
        });

        const testPerson2 = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "Peter",
            lastName: "Mueller",
            phone: "9876543210",
            email: "peter@test.de",
            address: {
                street: "Knobelsdorffstrasse 101",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 4,
                latitude: 4,
            },
            password: "BingoBingo9995!"
        });

        const testAnimalType = await animalTypeService.create({
            id: 9346,
            name: "Katze",
        });

        // Zwei verschiedene Tiere
        const testAnimal1 = await animalService.create({
            name: "Fluffy",
            lifestyle: "indoor",
            sex: "female",
            dateOfBirth: new Date(),
            dateOfBirthIsExact: true,
            weightInGram: 4500,
            heightInCm: null,
            timeOfDeath: null,
            isCastrated: true,
            animalTypeId: testAnimalType.id,
        });

        const testAnimal2 = await animalService.create({
            name: "Tiger",
            lifestyle: "outdoor",
            sex: "male",
            dateOfBirth: new Date(),
            dateOfBirthIsExact: false,
            weightInGram: 5000,
            heightInCm: null,
            timeOfDeath: null,
            isCastrated: false,
            animalTypeId: testAnimalType.id,
        });

        // Zwei Appointments
        const appointment1 = await appointmentService.create({
            startTime: new Date("2026-01-16T10:00:00Z"),
            endTime: new Date("2026-01-16T10:30:00Z"),
            veterinaryId: testVet.id,
            fk_veterinarypracticeid: testVetPractice.id,
            availableServiceIds: [testService.id],
        });

        const appointment2 = await appointmentService.create({
            startTime: new Date("2026-01-16T11:00:00Z"),
            endTime: new Date("2026-01-16T11:30:00Z"),
            veterinaryId: testVet.id,
            fk_veterinarypracticeid: testVetPractice.id,
            availableServiceIds: [testService.id],
        });

        // Verbinde die Tiere mit den Appointments
        await appointmentService.updateAppointmentAsPerson(
            appointment1.id,
            testAnimal1.id,
            testService.id,
        );

        await appointmentService.updateAppointmentAsPerson(
            appointment2.id,
            testAnimal2.id,
            testService.id,
        );

        // Verbinde die Tiere mit den Personen
        await personService.connectAnimal(testPerson1.id, testAnimal1.id);
        await personService.connectAnimal(testPerson2.id, testAnimal2.id);

        const animalAndPersons = await veterinaryPracticeService.getAnimalWithPerson(testVetPractice.id);

        expect(animalAndPersons).toHaveLength(2);
        expect(animalAndPersons[0].animal.name).toBe("Fluffy");
        expect(animalAndPersons[0].person.firstName).toBe("Anna");
        expect(animalAndPersons[1].animal.name).toBe("Tiger");
        expect(animalAndPersons[1].person.firstName).toBe("Peter");
    });

    it("getAnimalWithPerson should return empty array when appointments exist but no animals connected to persons", async () => {
        const testService = await serviceService.create({
            name: "Zahnreinigung",
            id: 9999999,
        });

        const testVetPractice = await veterinaryPracticeService.create({
            name: "EmptyPraxis",
            phone: "017632",
            email: "empty@info.de",
            infoEmail: "empty@info.de",
            website: null,
            info: null,
            address: {
                street: "Knobelsdorffstrasse 105",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 1,
                latitude: 1,
            },
            password: "Passwort123!"
        });

        const testPersonForVet = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "max",
            lastName: "mustermann",
            phone: "1234567789",
            email: "testee@test.de",
            address: {
                street: "Knobelsdorffstrasse 99",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 2,
                latitude: 2,
            },
            password: "BingoBingo9993!"
        });

        const testVet = await veterinaryService.create({
            id: testPersonForVet.id,
            firstName: testPersonForVet.firstName,
            lastName: testPersonForVet.lastName,
            infoEmail: "vet@info.de",
            fk_veterinarypracticeid: testVetPractice.id
        });

        const testAnimalType = await animalTypeService.create({
            id: 9346,
            name: "Katze",
        });

        const testAnimal = await animalService.create({
            name: "Fluffy",
            lifestyle: "indoor",
            sex: "female",
            dateOfBirth: new Date(),
            dateOfBirthIsExact: true,
            weightInGram: 4500,
            heightInCm: null,
            timeOfDeath: null,
            isCastrated: true,
            animalTypeId: testAnimalType.id,
        });

        // Appointment erstellen aber Animal NICHT mit Person verbinden
        const appointment = await appointmentService.create({
            startTime: new Date("2026-01-16T10:00:00Z"),
            endTime: new Date("2026-01-16T10:30:00Z"),
            veterinaryId: testVet.id,
            fk_veterinarypracticeid: testVetPractice.id,
            availableServiceIds: [testService.id],
        });

        await appointmentService.updateAppointmentAsPerson(
            appointment.id,
            testAnimal.id,
            testService.id,
        );

        // Kein personService.connectAnimal() → Animal hat keine Person!
        const animalAndPersons = await veterinaryPracticeService.getAnimalWithPerson(testVetPractice.id);
        expect(animalAndPersons).toEqual([]);
    });

    it("getAnimalWithPerson should handle duplicate animals with same person", async () => {
        const testService = await serviceService.create({
            name: "Impfung",
            id: 3242424,
        });

        const testVetPractice = await veterinaryPracticeService.create({
            name: "DuplicatePraxis",
            phone: "017632",
            email: "duplicate@info.de",
            infoEmail: "duplicate@info.de",
            website: null,
            info: null,
            address: {
                street: "Knobelsdorffstrasse 105",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 1,
                latitude: 1,
            },
            password: "Passwort123!"
        });

        const testPersonForVet = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "max",
            lastName: "mustermann",
            phone: "1234567789",
            email: "testee@test.de",
            address: {
                street: "Knobelsdorffstrasse 99",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 2,
                latitude: 2,
            },
            password: "BingoBingo9993!"
        });

        const testVet = await veterinaryService.create({
            id: testPersonForVet.id,
            firstName: testPersonForVet.firstName,
            lastName: testPersonForVet.lastName,
            infoEmail: "vet@info.de",
            fk_veterinarypracticeid: testVetPractice.id
        });

        const testPerson = await personService.create({
            sex: "male",
            dateOfBirth: new Date(),
            firstName: "John",
            lastName: "Doe",
            phone: "1234567789",
            email: "john@test.de",
            address: {
                street: "Knobelsdorffstrasse 100",
                cityCode: "DE",
                city: "Berlin",
                country: testCountry.id,
                longitude: 3,
                latitude: 3,
            },
            password: "BingoBingo9994!"
        });

        const testAnimalType = await animalTypeService.create({
            id: 9347,
            name: "Hund",
        });

        // Zwei verschiedene Tiere
        const testAnimal1 = await animalService.create({
            name: "Rex",
            lifestyle: "indoor",
            sex: "male",
            dateOfBirth: new Date(),
            dateOfBirthIsExact: true,
            weightInGram: 3000,
            heightInCm: null,
            timeOfDeath: null,
            isCastrated: true,
            animalTypeId: testAnimalType.id,
        });

        const testAnimal2 = await animalService.create({
            name: "Max",
            lifestyle: "outdoor",
            sex: "male",
            dateOfBirth: new Date(),
            dateOfBirthIsExact: false,
            weightInGram: 4000,
            heightInCm: null,
            timeOfDeath: null,
            isCastrated: false,
            animalTypeId: testAnimalType.id,
        });

        // Zwei Appointments mit den gleichen Tieren
        const appointment1 = await appointmentService.create({
            startTime: new Date("2026-01-16T10:00:00Z"),
            endTime: new Date("2026-01-16T10:30:00Z"),
            veterinaryId: testVet.id,
            fk_veterinarypracticeid: testVetPractice.id,
            availableServiceIds: [testService.id],
        });

        const appointment2 = await appointmentService.create({
            startTime: new Date("2026-01-16T11:00:00Z"),
            endTime: new Date("2026-01-16T11:30:00Z"),
            veterinaryId: testVet.id,
            fk_veterinarypracticeid: testVetPractice.id,
            availableServiceIds: [testService.id],
        });

        // Beide Appointments mit dem gleichen Animal und Person verbinden
        await appointmentService.updateAppointmentAsPerson(
            appointment1.id,
            testAnimal1.id,
            testService.id,
        );

        await appointmentService.updateAppointmentAsPerson(
            appointment2.id,
            testAnimal1.id,  // ← Gleiches Animal!
            testService.id,
        );

        // Animal mit Person verbinden
        await personService.connectAnimal(testPerson.id, testAnimal1.id);

        const animalAndPersons = await veterinaryPracticeService.getAnimalWithPerson(testVetPractice.id);

        // Sollte 2 mal das gleiche Animal-Person Pair zurückgeben (weil 2 Appointments)
        expect(animalAndPersons).toHaveLength(1);
        expect(animalAndPersons[0].animal.name).toBe("Rex");
        expect(animalAndPersons[0].person.firstName).toBe("John");
    });
})