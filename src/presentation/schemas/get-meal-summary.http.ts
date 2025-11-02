import z, { ZodType } from "zod";
import { PublicMealsSummaryDTO } from "../../application/dto/meal-dtos";

type GetMealSummarySuccessResponseType = {
    meals: PublicMealsSummaryDTO;
};

export const GetMealSummarySuccessResponse = z.object({
    meals: z.object({
        bestSequence: z.number(),
        mealsAmount: z.number(),
        mealOutDiet: z.number(),
        mealInDiet: z.number(),
    }),
}) satisfies ZodType<GetMealSummarySuccessResponseType>;
