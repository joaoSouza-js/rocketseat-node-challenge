import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import type { MealRepository } from "../../../domain/repositories/iu-meal-repository";
import type { UserRepository } from "../../../domain/repositories/iu-user-repository";
import type { GetMealsSummaryCommand, PublicMealsSummaryDTO } from "../../dto/meal-dtos";
import type { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work";

export class GetMealsSummary {
    constructor(
        private readonly meals: MealRepository,
        private readonly users: UserRepository,
        private readonly uow: UnitOfWork<AppTxCtx>
    ) { }

    async exec(input: GetMealsSummaryCommand) {
        const meals = await this.uow.withTransaction(async ({ tx }) => {
            const userExist = await this.users.findById(input.ownerId, tx)

            if (userExist === null) {
                throw new UserNotFoundError(input.ownerId)
            }

            const summary = await this.meals.mealSummary(input.ownerId, tx)

            const mealsFormatted: PublicMealsSummaryDTO = {
                bestSequence: summary.dietSequence,
                mealInDiet: summary.mealInDiet,
                mealOutDiet: summary.mealOutDiet,
                mealsAmount: summary.amount
            }
            return mealsFormatted
        })

        return meals
    }
}