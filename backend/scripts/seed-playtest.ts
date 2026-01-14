import { Sexes } from "../generated/prisma";
import { prisma } from "../src/singletonPC";

async function generatePlaytest() {
  const numberOfPlaytesters = 100;
  try {
    console.log("🌱 Seeding Impfer...");

    const impfzentrum = await prisma.veterinaryPractice.create({
      data: {
        email: 'admin@berlin.de',
        infoEmail: 'impfzentrum@berlin.de',
        name: 'Katzen Impfzentrum',
        password: 'VetPractice123!',
        phone: '+4930123456789',
        address: {
          create: {
            city: 'Berlin',
            cityCode: '13347',
            country: 'Deutschland',
            latitude: 1.0,
            longitude: 1.0,
            street: 'Impfstraße 5'
          }
        },
      }
    })

    await prisma.veterinarypractices_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date(),
          verified: true,
          fk_veterinarypracticeid: impfzentrum.id
        }
      });

    const impferPerson = await prisma.person.create({
      data: {
        dateOfBirth: new Date(),
        email: "impfer@berlin.de",
        firstName: "Impfer",
        lastName: "Arzt",
        password: "abjsabasdbsadas",
        phone: "+4930110",
        sex: 'male',
        addressId: 1,
      }
    });

    const impferArzt = await prisma.veterinarian.create({
      data: {
        fk_veterinarypracticeid: impfzentrum.id,
        id: impferPerson.id,
      }
    });

    const katzenAnimalTypeId = 2;
    await prisma.veterinaryCanTreatAnimalType.create({
      data: {
        animalTypeId: katzenAnimalTypeId,
        veterinaryId: impferArzt.id,
      }
    });

    const impfungServiceId = 3;
    await prisma.veterinaryHasService.create({
      data: {
        veterinaryId: impferArzt.id,
        serviceId: impfungServiceId
      }
    });

    const dates = [
      Date.parse("2025-12-19T09:00:00Z"),
      Date.parse("2025-12-19T09:30:00Z"),
      Date.parse("2025-12-19T10:00:00Z"),
      Date.parse("2025-12-19T10:30:00Z"),
      Date.parse("2025-12-19T11:00:00Z"),
      Date.parse("2025-12-19T11:30:00Z"),
      Date.parse("2025-12-19T13:00:00Z"),
      Date.parse("2025-12-19T13:00:00Z"),
      Date.parse("2025-12-19T14:00:00Z"),
      Date.parse("2025-12-19T15:00:00Z"),
      Date.parse("2025-12-19T16:00:00Z"),
      Date.parse("2025-12-19T17:00:00Z"),
      Date.parse("2025-12-19T18:00:00Z"),
      Date.parse("2025-12-19T19:00:00Z"),
      Date.parse("2025-12-19T20:00:00Z")
    ].map(x => new Date(x));

    for (let offset = 0; offset < 7; ++offset) {
      for (let i = 0; i < dates.length; ++i) {
        const startTime = dates[i];
        startTime.setDate(dates[i].getDate() + offset);
        const endTime = new Date(startTime.getTime() + 30 * 60000);
        const appointment = await prisma.appointment.create({
          data: {
            startTime: startTime,
            veterinaryId: impferArzt.id,
            veterinaryPracticeId: impfzentrum.id,
            endTime: endTime
          }
        });

        await prisma.appointmentHasService.create({
          data:{
            appointmentId: appointment.id,
            serviceId: 3
          }
        });
      }
    }


    console.log("🌱 Seeding Testers...");
    for (let i = 0; i < numberOfPlaytesters; ++i) {
      const maya = prisma.animal.create({
        data: {
          name: "Bambi",
          dateOfBirth: new Date("2021-01-13"),
          dateOfBirthIsExact: true,
          weightInGram: 4000,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "indoor",
          sex: "female",
          animalTypeId: 2,
          animalGroupId: null,
        }
      });

      const bambi = prisma.animal.create({
        data: {
          name: "Maya",
          dateOfBirth: new Date("2020-09-30"),
          dateOfBirthIsExact: true,
          weightInGram: 4300,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "female",
          animalTypeId: 2,
          animalGroupId: null,
        }
      });

      const playtester = prisma.person.create({
        data: {
          firstName: "Play",
          lastName: "Tester",
          dateOfBirth: new Date(),
          email: `playtester+${i}@bht-berlin.de`,
          password: "PlaytestVetilib123!",
          addressId: 1,
          phone: "+4930" + i * 10000,
          sex: 'male' as Sexes,
        }
      });

      const [a, b, c] = await Promise.all([maya, bambi, playtester]);

      const picture1 = prisma.animal.update({
        where: {
          id: a.id,
        },
        data: {
          picturePath: "public/placeholders/bambisFace.png",
        },
        select: {
          picturePath: true,
        },
      });

      const picture2 = prisma.animal.update({
        where: {
          id: b.id,
        },
        data: {
          picturePath: "public/placeholders/mayasFace.png",
        },
        select: {
          picturePath: true,
        },
      });

      const con1 = prisma.personHasAnimal.create({
        data: {
          personId: c.id,
          animalId: a.id
        }
      });

      const con2 = prisma.personHasAnimal.create({
        data: {
          personId: c.id,
          animalId: b.id
        }
      });

      await Promise.all([con1, con2, picture1, picture2]);

      await prisma.person_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date(),
          verified: true,
          fk_personid: c.id
        }
      });
    }

  } catch (error) {
    console.error("❌ Error seeding playtestdata:", error);
    process.exit(1);
  }
}

generatePlaytest();