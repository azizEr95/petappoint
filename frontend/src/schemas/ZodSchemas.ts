import { z } from "zod";


//Adressen: 
export const addressesSchema = z.object({
    id: z.number().int(),
    street: z.string().min(3).max(80),
    citycode: z.string().min(3).max(12),
    city: z.string().min(3).max(60),
    country: z.string().min(3).max(150),
    longitude: z.number(),
    latitude: z.number(),
});

export const addressesCreateSchema = addressesSchema.omit({
    id: true
});

export type addressesCreateType = z.infer<typeof addressesCreateSchema>;
export type addressesType = z.infer<typeof addressesSchema>;


//Tierarztpraxis:
export const VeterinaryPracticeSchema = z.object({
    id: z.number().int(),
    name: z.string().min(5).max(200),
    email: z.string().email().max(100),
    password: z.string().min(6).max(255),
    phone: z.string().min(5).max(20),
    infoemail: z.string().email().max(100),
    website: z.string().url().max(150).optional(),
    info: z.string().optional(),
    addresses: addressesSchema
})

export const VeterinaryPracticeCreateSchema = VeterinaryPracticeSchema.omit({
    id: true
}).extend({
    addresses: addressesCreateSchema
})

export type VeterinaryPracticesCreateType = z.infer<typeof VeterinaryPracticeCreateSchema>;
export type VeterinaryPracticesType = z.infer<typeof VeterinaryPracticeSchema>;


//alle weiteren Schemas hier auch reinschreiben