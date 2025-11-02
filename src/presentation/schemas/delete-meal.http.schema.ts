import z from "zod";

export const DeleteMealQueryParamsSchema = z.object({
    id: z.string()
})

export type DeleteMealQueryParams = z.infer<typeof DeleteMealQueryParamsSchema>