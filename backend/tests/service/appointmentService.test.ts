// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { appointments } from "../../generated/prisma";
// Dann den Service importieren
import { appointmentService } from "../../src/service/appointmentService";

describe("appointmentService", () => {
  // Test-Datenvorbereitung
  const mockAppointment: appointments = {
    id: 1,
    starttime: new Date("2025-01-15T10:00:00.000Z"),
    endtime: new Date("2025-01-15T11:00:00.000Z"),
    fk_animalid: 1,
    fk_veterinaryid: 1,
    fk_veterinarypracticeid: 1,
    fk_serviceid: 1,
  };

  const mockAppointmentWithRelations = {
    id: 1,
    starttime: new Date("2025-01-15T10:00:00.000Z"),
    endtime: new Date("2025-01-15T11:00:00.000Z"),
    fk_animalid: 1,
    fk_veterinaryid: 1,
    fk_veterinarypracticeid: 1,
    animals: {
      id: 1,
      name: "Bello",
      dateofbirth: new Date("2020-05-10"),
      fk_animaltypeid: 1,
    },
    veterinaries: {
      id: 1,
      infoemail: "tierarzt@praxis.de",
      fk_veterinarypractice: 1,
    },
  };

  describe("create", () => {
    it("sollte einen neuen Termin mit Tier erstellen", async () => {
      prismaMock.appointments.create.mockResolvedValue(mockAppointment);

      const result = await appointmentService.create(mockAppointment);

      expect(result).toEqual(mockAppointment);
      expect(prismaMock.appointments.create).toHaveBeenCalledWith({
        data: {
          starttime: mockAppointment.starttime,
          endtime: mockAppointment.endtime,
          animals: { connect: { id: mockAppointment.fk_animalid } },
          veterinaries: { connect: { id: mockAppointment.fk_veterinaryid } },
          veterinarypractices: { connect: { id: mockAppointment.fk_veterinarypracticeid } },
        },
      });
      expect(prismaMock.appointments.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Termin ohne Tier erstellen, wenn kein Tier angegeben ist", async () => {
      const appointmentWithoutAnimal = {
        ...mockAppointment,
        fk_animalid: null,
      };
      prismaMock.appointments.create.mockResolvedValue(appointmentWithoutAnimal);

      const result = await appointmentService.create(appointmentWithoutAnimal);

      expect(result).toEqual(appointmentWithoutAnimal);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.appointments.create.mockRejectedValue(error);

      await expect(appointmentService.create(mockAppointment)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte einen Termin anhand der ID mit Relationen finden", async () => {
      prismaMock.appointments.findUnique.mockResolvedValue(mockAppointmentWithRelations as any);

      const result = await appointmentService.getById(1);

      expect(result).toEqual(mockAppointmentWithRelations);
    });

    it("sollte einen Fehler werfen, wenn der Termin nicht gefunden wird", async () => {
      prismaMock.appointments.findUnique.mockResolvedValue(null);

      await expect(appointmentService.getById(999)).rejects.toThrow("Appointment not found with id: 999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Termine finden", async () => {
      const mockAppointments = [
        mockAppointment,
        {
          id: 2,
          starttime: new Date("2025-01-16T14:00:00.000Z"),
          endtime: new Date("2025-01-16T15:00:00.000Z"),
          fk_animalid: 2,
          fk_veterinaryid: 1,
          fk_veterinarypracticeid: 1,
        },
        {
          id: 3,
          starttime: new Date("2025-01-17T09:00:00.000Z"),
          endtime: new Date("2025-01-17T10:00:00.000Z"),
          fk_animalid: 3,
          fk_veterinaryid: 2,
          fk_veterinarypracticeid: 1,
        },
      ];

      prismaMock.appointments.findMany.mockResolvedValue(mockAppointments);

      const result = await appointmentService.getAll();

      expect(result).toEqual(mockAppointments);
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Termine existieren", async () => {
      prismaMock.appointments.findMany.mockResolvedValue([]);

      const result = await appointmentService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getAppointmentsByDateRange", () => {
    it("sollte Termine innerhalb eines Zeitraums mit Relationen finden", async () => {
      const startDate = new Date("2025-01-15T00:00:00.000Z");
      const endDate = new Date("2025-01-20T23:59:59.000Z");

      const mockAppointments = [
        mockAppointmentWithRelations,
        {
          id: 2,
          starttime: new Date("2025-01-16T14:00:00.000Z"),
          endtime: new Date("2025-01-16T15:00:00.000Z"),
          fk_animalid: 2,
          fk_veterinaryid: 1,
          fk_veterinarypracticeid: 1,
          animals: {
            id: 2,
            name: "Minka",
            dateofbirth: new Date("2019-03-15"),
            fk_animaltypeid: 2,
          },
          veterinaries: {
            id: 1,
            infoemail: "tierarzt@praxis.de",
            fk_veterinarypractice: 1,
          },
        },
      ];

      prismaMock.appointments.findMany.mockResolvedValue(mockAppointments as any);

      const result = await appointmentService.getAppointmentsByDateRange(startDate, endDate);

      expect(result).toEqual(mockAppointments);
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Termine im Zeitraum existieren", async () => {
      const startDate = new Date("2025-02-01T00:00:00.000Z");
      const endDate = new Date("2025-02-28T23:59:59.000Z");

      prismaMock.appointments.findMany.mockResolvedValue([]);

      const result = await appointmentService.getAppointmentsByDateRange(startDate, endDate);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getAppointmentsByVeterinary", () => {
    it("sollte alle Termine eines bestimmten Tierarztes mit Relationen finden", async () => {
      const mockAppointments = [
        mockAppointmentWithRelations,
        {
          id: 2,
          starttime: new Date("2025-01-16T14:00:00.000Z"),
          endtime: new Date("2025-01-16T15:00:00.000Z"),
          fk_animalid: 2,
          fk_veterinaryid: 1,
          fk_veterinarypracticeid: 1,
          animals: {
            id: 2,
            name: "Minka",
            dateofbirth: new Date("2019-03-15"),
            fk_animaltypeid: 2,
          },
          veterinaries: {
            id: 1,
            infoemail: "tierarzt@praxis.de",
            fk_veterinarypractice: 1,
          },
        },
      ];

      prismaMock.appointments.findMany.mockResolvedValue(mockAppointments as any);

      const result = await appointmentService.getAppointmentsByVeterinary(1);

      expect(result).toEqual(mockAppointments);
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn der Tierarzt keine Termine hat", async () => {
      prismaMock.appointments.findMany.mockResolvedValue([]);

      const result = await appointmentService.getAppointmentsByVeterinary(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte einen Termin aktualisieren", async () => {
      const updatedAppointment = {
        ...mockAppointment,
        starttime: new Date("2025-01-15T11:00:00.000Z"),
        endtime: new Date("2025-01-15T12:00:00.000Z"),
      };

      prismaMock.appointments.update.mockResolvedValue(updatedAppointment);

      const result = await appointmentService.update(updatedAppointment);

      expect(result).toEqual(updatedAppointment);
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const appointmentWithoutId = { ...mockAppointment, id: undefined } as any;

      await expect(appointmentService.update(appointmentWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn der zu aktualisierende Termin nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.appointments.update.mockRejectedValue(error);

      await expect(appointmentService.update({ ...mockAppointment, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte einen Termin löschen", async () => {
      prismaMock.appointments.delete.mockResolvedValue(mockAppointment);

      await appointmentService.delete(1);

      expect(prismaMock.appointments.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.appointments.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn der zu löschende Termin nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.appointments.delete.mockRejectedValue(error);

      await expect(appointmentService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
