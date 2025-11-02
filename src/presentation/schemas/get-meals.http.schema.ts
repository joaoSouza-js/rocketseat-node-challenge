import z, { ZodType } from "zod";
import { PublicMealDTO } from "../../application/dto/meal-dtos";

type getMealResponseSuccessType = {
    meals: PublicMealDTO[]
}


export const GetMealsSuccessResponse = z.object({
    meals: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        ownerId: z.string().optional(),
        isInDiet: z.boolean(),
    }))
}) satisfies ZodType<getMealResponseSuccessType>

