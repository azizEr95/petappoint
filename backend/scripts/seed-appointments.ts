import { prisma } from "../src/singletonPC";

/**
 * Seed appointments with future dates
 * Deletes existing appointments and generates new ones for next 4 weeks
 */
async function seedAppointments() {
  console.log("🌱 Seeding appointments...");

  try {
    // Delete all existing appointments
    const deleted1 = await prisma.appointmentHasService.deleteMany({});
    const deleted = await prisma.appointment.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.count} old appointments`);

    // Get all practices, vets, services
    const practices = await prisma.veterinaryPractice.findMany({
      select: { id: true },
    });
    const vets = await prisma.veterinarian.findMany({
      select: { id: true, fk_veterinarypracticeid: true },
    });
    const services = await prisma.service.findMany({
      select: { id: true },
    });

    if (practices.length === 0 || vets.length === 0) {
      console.log("❌ No practices or vets found. Run testdaten.sql first.");
      return;
    }

    const appointments: any[] = [];
    const now = new Date();
    const appointmentHasService: any[] = [];

    // Generate ~1000 appointments across all practices
    // Even index (0,2,4...): appointments from tomorrow
    // Odd index (1,3,5...): appointments start in 2 weeks
    for (const [index, practice] of practices.entries()) {
      const practiceVets = vets.filter((v) => v.fk_veterinarypracticeid === practice.id);
      const practiceServices = services;
      const availableVets = practiceVets.length > 0 ? practiceVets : vets;

      // Odd practices: start appointments in 2 weeks
      const startOffset = index % 2 === 1 ? 14 : 1;
      if (index % 2 === 1) {
        console.log(`📆 Practice ${practice.id}: first appointment in 2 weeks`);
      }

      // Generate appointments for next 4 weeks
      for (let dayOffset = startOffset; dayOffset <= 28; dayOffset++) {
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

          const vet = availableVets[Math.floor(Math.random() * availableVets.length)];

          appointments.push({
            startTime,
            endTime,
            animalId: null,
            veterinaryId: vet.id,
            veterinaryPracticeId: practice.id,
            serviceId: null,
            notes: null,
          });
        }
      }
    }

    // Create appointments
    const created = await prisma.appointment.createMany({
      data: appointments,
    });
    const appointmentIDs = await prisma.appointment.findMany({
      select: { id: true },
    });

    appointmentIDs.forEach((x) => {
      appointmentHasService.push({
        // add service for every appointment
        appointmentId: x.id,
        serviceId: 1,
      });
    });
    const created2 = await prisma.appointmentHasService.createMany({
      data: appointmentHasService,
    });

    console.log(`✅ Created ${created.count} new appointments`);
    console.log(
      `📅 Date range: ${appointments[0].startTime.toLocaleDateString()} - ${appointments[appointments.length - 1].startTime.toLocaleDateString()}`
    );
  } catch (error) {
    console.error("❌ Error seeding appointments:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAppointments();
