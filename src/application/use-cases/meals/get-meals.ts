import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import type { MealRepository } from "../../../domain/repositories/iu-meal-repository";
import type { UserRepository } from "../../../domain/repositories/iu-user-repository";
import type { GetMealsCommand, PublicMealDTO } from "../../dto/meal-dtos";
import type { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work";

export class GetMeals {
    constructor(
        private readonly meals: MealRepository,
        private readonly users: UserRepository,
        private readonly uow: UnitOfWork<AppTxCtx>
    ) { }

    async exec(input: GetMealsCommand) {
        const meals = await this.uow.withTransaction(async ({ tx }) => {
            const userExist = await this.users.findById(input.ownerId, tx)

            if (userExist === null) {
                throw new UserNotFoundError(input.ownerId)
            }

            const meals = await this.meals.findUserMeals(input.ownerId, tx)

            const mealsFormatted: PublicMealDTO[] = meals.map(meal => {
                const mealFormatted: PublicMealDTO = {
                    date: meal.date,
                    description: meal.description,
                    id: meal.id,
                    isInDiet: meal.isInDiet,
                    name: meal.name,
                }

                return mealFormatted
            })
            return mealsFormatted
        })

        return meals
    }
}