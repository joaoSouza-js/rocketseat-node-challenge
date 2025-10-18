import { Meal } from "../../../domain/entities/meal";
import { MealNotFoundError } from "../../../domain/errors/meal-not-found.error";
import { MealWrongOwner } from "../../../domain/errors/meal-wrong-owner";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import type { MealRepository } from "../../../domain/repositories/iu-meal-repository";
import type { UserRepository } from "../../../domain/repositories/iu-user-repository";
import { CurrentDate } from "../../../domain/value-objects/current-date";
import type { UpdateMealCommand } from "../../dto/meal-dtos";
import type { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work";

export class UpdateMeal {
    constructor(
        private readonly meals: MealRepository,
        private readonly users: UserRepository,
        private readonly uow: UnitOfWork<AppTxCtx>
    ) { }

    async exec(input: UpdateMealCommand) {
        await this.uow.withTransaction(async ({ tx }) => {
            const userExist = await this.users.findById(input.ownerId, tx)

            if (userExist === null) {
                throw new UserNotFoundError(input.ownerId)
            }

            const mealExist = await this.meals.findUserMeal(input.ownerId, input.mealId, tx)

            if (mealExist === null) {
                throw new MealNotFoundError(input.mealId)
            }

            const schedule = CurrentDate.fromDate(input.date)
            const updatedSchedule = CurrentDate.fromDate(mealExist.date)

            const meal = Meal.rehydrate({
                createdAt: mealExist.createdAt,
                date: schedule ?? updatedSchedule,
                description: input.description ?? mealExist.description,
                id: mealExist.id,
                isInDiet: input.isInDiet ?? mealExist.isInDiet,
                name: input.name ?? mealExist.name,
                userId: userExist.id,
                updatedAt: mealExist.updatedAt,
            })

            await this.meals.update(meal, tx)


        })
    }
}