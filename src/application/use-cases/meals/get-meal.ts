import { MealNotFoundError } from "../../../domain/errors/meal-not-found.error";
import { MealWrongOwner } from "../../../domain/errors/meal-wrong-owner";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import type { MealRepository } from "../../../domain/repositories/iu-meal-repository";
import type { UserRepository } from "../../../domain/repositories/iu-user-repository";
import type { GetMealCommand, PublicMealDTO } from "../../dto/meal-dtos";
import type { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work";

export class GetMeal {
    constructor(
        private readonly meals: MealRepository,
        private readonly users: UserRepository,
        private readonly uow: UnitOfWork<AppTxCtx>
    ) { }

    async exec(input: GetMealCommand) {
        const meal = await this.uow.withTransaction(async ({ tx }) => {
            const userExist = await this.users.findById(input.ownerId, tx)

            if (userExist === null) {
                throw new UserNotFoundError(input.ownerId)
            }

            const mealExist = await this.meals.findMeal(input.mealId, tx)

            if (mealExist === null) {
                throw new MealNotFoundError(input.mealId)
            }

            if (mealExist.ownerId !== input.ownerId) {
                throw new MealWrongOwner(input.mealId)
            }

            const meal: PublicMealDTO = {
                date: mealExist.date,
                description: mealExist.description,
                id: mealExist.id,
                isInDiet: mealExist.isInDiet,
                name: mealExist.name,
            }

            return meal
        })

        return meal
    }
}