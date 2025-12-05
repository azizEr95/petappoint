import request from "supertest";
import { prismaMock } from "../../testConfig/mockConfig";
import { app } from "../../src/app";
import { LoginValidatorType } from "vetilib-shared/schemas/ZodSchemas";
import { hashPassword } from "../../src/utils/password";

let createdAdresse: {
    id: number;
    street: string;
    citycode: string;
    city: string;
    country: string;
    longitude: number;
    latitude: number;
};


let createdPerson: {
    firstname: string,
    lastname: string,
    sex: string,
    dateofbirth: Date,
    phone: string,
    email: string,
    password: string,
    fk_address: number,
}

beforeAll(async () => {
    createdAdresse = {
        id: 1,
        street: "Lesser-Ury-Weg 27",
        citycode: "10557",
        city: "Berlin",
        country: "Germany",
        longitude: 0.0,
        latitude: 0.0,
    };

    createdPerson = {
        firstname: "Aziz",
        lastname: "Erol",
        sex: "male",
        dateofbirth: new Date("December 17, 1995 03:24:00"),
        phone: "015759712682",
        email: "aziz@bht-berlin.de",
        password: "HabboHotel123",
        fk_address: createdAdresse.id,
    }

    prismaMock.addresses.create(createdAdresse);
    prismaMock.person.create(createdPerson);

    prismaMock.person.findUnique.mockResolvedValue({
        id: 1,
        email: "aziz@bht-berlin.de",
        password: "HabboHotel123",
        roles: ["person"]
    });

});

test("Einfacher Login", async () => {
    const requestData: LoginValidatorType = {
                    email: "aziz@bht-berlin.de",
                    password: "HabboHotel123",
                };
    const response = await request(app)
        .post('/api/login')
        .send(requestData);

    console.log(response.body);
    console.log(response.statusCode);
    expect(response.statusCode).toBe(201);
})