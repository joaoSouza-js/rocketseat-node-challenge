import type { Meal } from "../../domain/entities/meal";
import type { PublicMealDTO } from "../dto/meal-dtos";

export function toPublicMealDTO(meal: Meal): PublicMealDTO {
    const publicMeal: PublicMealDTO = {
        date: meal.createdAt,
        description: meal.description,
        id: meal.id,
        ownerId: meal.ownerId,
        isInDiet: meal.isInDiet,
        name: meal.name,

    }
    return publicMeal
}