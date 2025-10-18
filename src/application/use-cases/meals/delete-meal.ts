import { MealNotFoundError } from "../../../domain/errors/meal-not-found.error";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import { MealRepository } from "../../../domain/repositories/iu-meal-repository";
import { UserRepository } from "../../../domain/repositories/iu-user-repository";
import { DeleteMealCommand } from "../../dto/meal-dtos";
import { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work";

export class DeleteMeal {
    constructor(
        private readonly meals: MealRepository,
        private readonly users: UserRepository,
        private readonly uow: UnitOfWork<AppTxCtx>
    ) { }

    async exec(input: DeleteMealCommand) {
        await this.uow.withTransaction(async ({ tx }) => {
            const useExist = this.users.findById(input.ownerId)

            if (useExist === null) {
                throw new UserNotFoundError(input.ownerId)
            }

            const mealExist = await this.meals.findUserMeal(input.ownerId, input.mealId, tx)

            if (mealExist === null) {
                throw new MealNotFoundError(input.mealId)
            }

            await this.meals.deleteMeal(mealExist.id, tx)

        })
    }
}
