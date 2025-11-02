import z from "zod"

export const UpdateMealSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(8).max(255).optional(),
    date: z.coerce.date().optional(),
    isInDiet: z.coerce.boolean().default(false).optional()

})

export const UpdateMealSchemaParamsSchema = z.object({
    id: z.string()
})

export type UpdateMealBody = z.infer<typeof UpdateMealSchema>
export type UpdateMealSchemaParams = z.infer<typeof UpdateMealSchemaParamsSchema>



