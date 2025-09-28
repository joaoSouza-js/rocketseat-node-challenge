import { Meal } from "../../../domain/entities/meal";
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error";
import type { MealRepository } from "../../../domain/repositories/iu-meal-repository";
import type { UserRepository } from "../../../domain/repositories/iu-user-repository";
import type { RegisterMealCommand } from "../../dto/meal-dtos";
import type { IdGenerator } from "../../ports/id-generator";
import type { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work";

export class RegisterMeal {

    constructor(
        private readonly meals: MealRepository,
        private readonly users: UserRepository,
        private readonly ids: IdGenerator,
        private readonly uow: UnitOfWork<AppTxCtx>,

    ) { }

    async exec(input: RegisterMealCommand) {
        const mealId = await this.uow.withTransaction(async ({ tx }) => {
            const user = await this.users.findById(input.userId, tx)

            if (!user) {
                throw new UserNotFoundError('User not found')
            }

            const meal = Meal.create({
                date: input.date,
                description: input.description,
                id: this.ids.next(),
                isInDiet: input.isInDiet,
                name: input.name,
                userId: input.userId
            })

            this.meals.create(meal, tx)

            return meal.id
        })

        return mealId
    }
}