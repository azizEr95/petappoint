import { describe, expect, it } from "vitest";
import { animalGroupService } from "../../src/service/animalGroupService";
import { ResourceNotFoundError } from "../../src/exceptions/errors/ResourceNotFoundError";

describe("animalGroupService CRUD Functions", () => {
    const testAnimalGroup = {
        name: "Hunde",
    };

    it("create an animal group", async () => {
        const createdGroup = await animalGroupService.create(testAnimalGroup);

        const getGroup = await animalGroupService.getById(createdGroup.id);
        expect(getGroup).toStrictEqual(createdGroup);
    });

    it("animal group getById", async () => {
        const createdGroup = await animalGroupService.create(testAnimalGroup);

        const getGroupById = await animalGroupService.getById(createdGroup.id);
        expect(getGroupById).toStrictEqual(createdGroup);
    });

    it("animal group getAll", async () => {
        const createGroup = await animalGroupService.create(testAnimalGroup);
        await animalGroupService.create({ name: "Katzen" });
        await animalGroupService.create({ name: "Fische" });

        const getAllGroups = await animalGroupService.getAll();
        expect(getAllGroups).toHaveLength(3);
        expect(getAllGroups[0]).toStrictEqual(createGroup);
    });

    it("update animal group", async () => {
        const createdGroup = await animalGroupService.create(testAnimalGroup);

        const updatedGroup = await animalGroupService.update({
            id: createdGroup.id,
            name: "Haustiere",
        });
        expect(updatedGroup.name).toBe("Haustiere");
    });

    it("update animal group, throws ResourceNotFoundError for non-existing ID", async () => {
        await expect(animalGroupService.getById(999999)).rejects.toThrow(
            ResourceNotFoundError
        );
    });

    it("delete an animal group", async () => {
        const createdGroup = await animalGroupService.create(testAnimalGroup);

        await animalGroupService.delete(createdGroup.id);
        await expect(
            animalGroupService.getById(createdGroup.id)
        ).rejects.toThrow(ResourceNotFoundError);
    });
});
