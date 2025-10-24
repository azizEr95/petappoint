import { addressResource } from 'src/Resource';
import { prisma } from '../singletonPC';

export const addressService = {
    // Create
    async create(addressRe: addressResource): Promise<addressResource> {
        const createdAddress = await prisma.addresses.create({
            data: {
                street: addressRe.street,
                citycode: addressRe.citycode,
                city: addressRe.city,
                country: addressRe.country,
                longitude: addressRe.longitude,
                latitude: addressRe.latitude
            }
        });

        return mapAddressToResource(createdAddress);
    },

    // Read by ID
    async getById(id: number): Promise<addressResource> {
        const foundAddress = await prisma.addresses.findUnique({
            where: { id }
        });

        if (!foundAddress) {
            throw new Error(`Address not found with id: ${id}`);
        }

        return mapAddressToResource(foundAddress);
    },

    // Update
    async update(adressRe: addressResource): Promise<addressResource> {
        if (!adressRe.id) {
            throw new Error('ID is required for update');
        }

        const updatedAddress = await prisma.addresses.update({
            where: { id: adressRe.id },
            data: {
                street: adressRe.street,
                citycode: adressRe.citycode,
                city: adressRe.city,
                country: adressRe.country,
                longitude: adressRe.longitude,
                latitude: adressRe.latitude
            }
        });
        
        return mapAddressToResource(updatedAddress);
    },

    // Delete
    async delete(id: number): Promise<void> {
        await prisma.addresses.delete({
            where: { id }
        });
    },

    // Optional: List all addresses
    async getAll(): Promise<addressResource[]> {
        const addresses = await prisma.addresses.findMany();
        return addresses.map(mapAddressToResource);
    }
};

// Helper function to map Prisma address to resource
function mapAddressToResource(address: any): addressResource {
    return {
        id: address.id,
        street: address.street,
        city: address.city,
        citycode: address.citycode,
        country: address.country,
        longitude: address.longitude,
        latitude: address.latitude
    };
}