import type { Meal } from "../entities/meal";

export interface MealRepository {
    create(meal: Meal, tx: unknown): Promise<void>,
    update(meal: Meal, tx: unknown): Promise<void>,
    findMeal(mealId: string, tx: unknown): Promise<Meal | null>,
    findUserMeal(ownerId: string, mealId: string, tx: unknown): Promise<Meal | null>
    findUserMeals(ownerId: string, tx: unknown): Promise<Meal[]>,
    deleteMeal(mealId: string, tx: unknown): Promise<null>
}