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

        return []
    }
}