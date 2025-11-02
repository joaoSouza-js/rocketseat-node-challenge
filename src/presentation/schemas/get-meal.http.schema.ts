import z, { ZodType } from "zod";
import { PublicMealDTO } from "../../application/dto/meal-dtos";

export const GetMealQueryParamsSchema = z.object({
    id: z.string()
})

type getMealResponseSuccessType = {
    meal: PublicMealDTO
}

export const GetMealSuccessResponseSchema = z.object({
    meal: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        ownerId: z.string().optional(),
        isInDiet: z.boolean(),
    })
}) satisfies ZodType<getMealResponseSuccessType>

export type GetMealQueryParams = z.infer<typeof GetMealQueryParamsSchema>
