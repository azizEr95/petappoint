import { beforeEach, describe, expect, it } from "vitest";
import { appointmentService } from "../../src/service/appointmentService";
import { veterinaryService } from "../../src/service/veterinaryService";
import { veterinaryPracticeService } from "../../src/service/veterinaryPracticeService";
import { personService } from "../../src/service/personService";
import { serviceService } from "../../src/service/serviceService";
import { countryService } from "../../src/service/countryService";
import { AppointmentsType, CountryType } from "vetilib-shared/schemas/ZodSchemas";
import { createDateTime } from "../../src/helper/createDateTime";

describe("appointmentService CRUD Functions", () => {
    let testCountry: CountryType;

    beforeEach(async () => {
        testCountry = await countryService.create({
            code: "DEU",
            name: "Deutschland",
        });
    });

    it("create an appointment", async () => {
        const testService = await serviceService.create({
            name: "Impfung",
            id: 3242423,
        })
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
        })
        const testPerson = await personService.create({
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

        })
        const testVet = await veterinaryService.create({
            firstName: "Bello",
            lastName: "Bello",
            id: testPerson.id,
            infoEmail: "vet@info.de",
            fk_veterinarypracticeid: testVetPractice.id
        });
        const startTime = new Date("2026-01-16T09:00:00Z");
        const endTime = new Date("2026-01-16T09:30:00Z");
        const endDate = new Date("2026-01-30T09:00:00Z");
        const testAppointment = {
            startTime: startTime,
            endTime: endTime,
            endDate: endDate,
            veterinaryId: testVet.id,
            fk_veterinarypracticeid: testVetPractice.id,
            availableServiceIds: [testService.id],
        }
        const appointments: AppointmentsType[] = await appointmentService.createWeeklyAppointments(testAppointment);
        const getAppointment1 = await appointmentService.getById(appointments[0].id);
        expect(getAppointment1).toStrictEqual(appointments[0]);
        expect(createDateTime(getAppointment1.startTime)).toBe("Freitag, 16. Januar 2026 um 10:00")
        expect(createDateTime(getAppointment1.endTime)).toBe("Freitag, 16. Januar 2026 um 10:30")

        const getAppointment2 = await appointmentService.getById(appointments[1].id);
        expect(getAppointment2).toStrictEqual(appointments[1]);
        expect(createDateTime(getAppointment2.startTime)).toBe("Freitag, 23. Januar 2026 um 10:00")
        expect(createDateTime(getAppointment2.endTime)).toBe("Freitag, 23. Januar 2026 um 10:30")

        const getAppointment3 = await appointmentService.getById(appointments[2].id);
        expect(getAppointment3).toStrictEqual(appointments[2]);
        expect(createDateTime(getAppointment3.startTime)).toBe("Freitag, 30. Januar 2026 um 10:00")
        expect(createDateTime(getAppointment3.endTime)).toBe("Freitag, 30. Januar 2026 um 10:30")
    });
})