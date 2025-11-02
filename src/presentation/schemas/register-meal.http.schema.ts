import z from "zod";

export const RegisterMealBodySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(8).max(255),
    date: z.coerce.date(),
    isInDiet: z.coerce.boolean().default(false),
})

export const RegisterMealSuccessResponse = z.object({
    id: z.string()
})

export type RegisterMealBody = z.infer<typeof RegisterMealBodySchema>