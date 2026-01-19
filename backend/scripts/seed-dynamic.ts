import { prisma } from "../src/singletonPC";

/**
 * Seed date-relative appointments
 * Deletes existing appointments and generates:
 * - Past appointments (-14 to -1 days): ~1000 total
 * - Future appointments (+1 to +28 days): ~3500 total
 * Uses date-relative logic so appointments shift each day
 */
async function seedDynamic() {
  console.log("🌱 Seeding dynamic appointments...");

  try {
    // Get all practices, vets, services, animals
    const practices = await prisma.veterinaryPractice.findMany({
      select: { id: true },
    });
    const vets = await prisma.veterinarian.findMany({
      select: { id: true, fk_veterinarypracticeid: true },
    });
    const services = await prisma.service.findMany({
      select: { id: true },
    });
    const animals = await prisma.animal.findMany({
      select: { id: true },
    });

    if (practices.length === 0 || vets.length === 0) {
      console.log("❌ No practices or vets found. Run seed:static first.");
      return;
    }

    console.log("🗑️  Deleting old appointments...");
    await prisma.$transaction(async (tx) => {
      await tx.appointmentHasService.deleteMany({});
      await tx.appointment.deleteMany({});
    });

    const appointments: any[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // ============================
    // Past Appointments (-14 to -1 days)
    // ============================
    console.log("📅 Generating past appointments (-14 to -1 days)...");

    for (const practice of practices) {
      const practiceVets = vets.filter((v) => v.fk_veterinarypracticeid === practice.id);
      if (practiceVets.length === 0) {
        continue;
      }

      // Generate past appointments
      for (let dayOffset = -14; dayOffset <= -1; dayOffset++) {
        const date = new Date(now);
        date.setDate(date.getDate() + dayOffset);

        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Weekdays: 5-8 appointments, Weekends: 2-4 appointments
        const appointmentsPerDay = isWeekend ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 4) + 5;

        for (let i = 0; i < appointmentsPerDay; i++) {
          const hour = 8 + Math.floor(Math.random() * 10);
          const minute = Math.random() > 0.5 ? 0 : 30;

          const startTime = new Date(date);
          startTime.setHours(hour, minute, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 30 + Math.floor(Math.random() * 3) * 15);

          const vet = practiceVets[Math.floor(Math.random() * practiceVets.length)];

          // 30-40% of past appointments have animals
          const hasAnimal = Math.random() < 0.35;
          const animalId = hasAnimal && animals.length > 0 ? animals[Math.floor(Math.random() * animals.length)].id : null;

          appointments.push({
            startTime,
            endTime,
            animalId,
            veterinaryId: vet.id,
            veterinaryPracticeId: practice.id,
            serviceId: null,
            notes: null,
          });
        }
      }
    }

    // ============================
    // Future Appointments (+1 to +28 days)
    // ============================
    console.log("📅 Generating future appointments (+1 to +28 days)...");

    for (const practice of practices) {
      const practiceVets = vets.filter((v) => v.fk_veterinarypracticeid === practice.id);
      if (practiceVets.length === 0) {
        continue;
      }

      // Practices 11-15: start appointments in 2 weeks (day 15)
      const startOffset = practice.id >= 11 ? 15 : 1;

      // Generate future appointments
      for (let dayOffset = startOffset; dayOffset <= 28; dayOffset++) {
        const date = new Date(now);
        date.setDate(date.getDate() + dayOffset);

        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Weekdays: 8-12 appointments, Weekends: 4-6 appointments
        const appointmentsPerDay = isWeekend ? Math.floor(Math.random() * 3) + 4 : Math.floor(Math.random() * 5) + 8;

        for (let i = 0; i < appointmentsPerDay; i++) {
          const hour = 8 + Math.floor(Math.random() * 10);
          const minute = Math.random() > 0.5 ? 0 : 30;

          const startTime = new Date(date);
          startTime.setHours(hour, minute, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 30 + Math.floor(Math.random() * 3) * 15);

          const vet = practiceVets[Math.floor(Math.random() * practiceVets.length)];

          // 100% of future appointments have animals
          const animalId = animals.length > 0 ? animals[Math.floor(Math.random() * animals.length)].id : null;

          appointments.push({
            startTime,
            endTime,
            animalId,
            veterinaryId: vet.id,
            veterinaryPracticeId: practice.id,
            serviceId: null,
            notes: null,
          });
        }
      }
    }

    // ============================
    // Batch Create Appointments
    // ============================
    console.log(`📝 Creating ${appointments.length} appointments in batches...`);

    const batchSize = 1000;
    for (let i = 0; i < appointments.length; i += batchSize) {
      const batch = appointments.slice(i, i + batchSize);
      await prisma.appointment.createMany({
        data: batch,
      });
      console.log(`✓ Created ${Math.min(i + batchSize, appointments.length)}/${appointments.length}`);
    }

    // ============================
    // Create Appointment-Service Links
    // ============================
    console.log("🔗 Linking appointments to services...");

    const appointmentIDsWithVet = await prisma.appointment.findMany({
      select: { id: true, veterinaryId: true },
    });

    const vetServices = await prisma.veterinaryHasService.findMany({
      select: { veterinaryId: true, serviceId: true },
    });
    const vetServiceMap = new Map<number, number[]>();
    for (const { veterinaryId, serviceId } of vetServices) {
      const arr = vetServiceMap.get(veterinaryId) ?? [];
      arr.push(serviceId);
      vetServiceMap.set(veterinaryId, arr);
    }

    const appointmentHasService: { appointmentId: number; serviceId: number }[] = [];
    for (const appt of appointmentIDsWithVet) {
      const serviceIds = vetServiceMap.get(appt.veterinaryId) ?? [];
      for (const sId of serviceIds) {
        appointmentHasService.push({
          appointmentId: appt.id,
          serviceId: sId,
        });
      }
    }

    if (appointmentHasService.length > 0) {
      for (let i = 0; i < appointmentHasService.length; i += batchSize) {
        const batch = appointmentHasService.slice(i, i + batchSize);
        await prisma.appointmentHasService.createMany({
          data: batch,
        });
      }
    }

    // ============================
    // Summary
    // ============================
    console.log("\n✅ Dynamic seeding complete!");
    console.log(`   📅 Total appointments: ${appointments.length}`);
    console.log(`   📋 Date range: ${appointments[0].startTime.toLocaleDateString()} - ${appointments[appointments.length - 1].startTime.toLocaleDateString()}`);

    // Count appointments by range
    const pastCount = appointments.filter((a) => a.startTime < now).length;
    const futureCount = appointments.filter((a) => a.startTime >= now).length;
    const booked = appointments.filter((a) => a.animalId !== null).length;

    console.log(`   📆 Past appointments: ${pastCount}`);
    console.log(`   📆 Future appointments: ${futureCount}`);
    console.log(`   🐾 Booked appointments: ${booked}`);
  } catch (error) {
    console.error("❌ Error seeding dynamic data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDynamic();
