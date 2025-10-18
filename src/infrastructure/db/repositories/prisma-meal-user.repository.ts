import { Prisma } from "@prisma/client/extension";
import { MealRepository } from "../../../domain/repositories/iu-meal-repository";
import { PrismaClient } from "../../../../generated/prisma";
import { Meal } from "../../../domain/entities/meal";
import { CurrentDate } from "../../../domain/value-objects/current-date";


type DbClient = Pick<PrismaClient, "meals">


export class PrismaMealRepository implements MealRepository {
    constructor(private readonly prisma: PrismaClient) {

    }

    getClient(tx: Prisma.TransactionClient): DbClient {
        const client: DbClient = tx ?? this.prisma
        return client
    }

    async findMeal(mealId: string, tx: unknown): Promise<Meal | null> {
        const client = this.getClient(tx);
        const existMeal = await client.meals.findUnique({
            where: { id: mealId }
        });
        if (existMeal === null) return null

        const meal = Meal.rehydrate({
            createdAt: existMeal.created_at,
            date: CurrentDate.fromDate(existMeal.date),
            description: existMeal.description,
            id: existMeal.id,
            isInDiet: existMeal.is_in_diet,
            name: existMeal.name,
            updatedAt: existMeal.updated_at,
            userId: existMeal.userId
        })

        return meal
    }

    async create(meal: Meal, tx: unknown): Promise<void> {
        const client = this.getClient(tx);
        await client.meals.create({
            data: {
                date: meal.date,
                description: meal.description,
                id: meal.id,
                is_in_diet: meal.isInDiet,
                name: meal.name,
                userId: meal.ownerId,
            }
        })

    }

    async findUserMeals(ownerId: string, tx: unknown): Promise<Meal[]> {
        const client = this.getClient(tx)
        const mealsFound = await client.meals.findMany({
            where: {
                userId: ownerId
            }
        })

        const meals = mealsFound.map(meal => {
            const mealClass = Meal.rehydrate({
                createdAt: meal.created_at,
                date: CurrentDate.fromDate(meal.date),
                description: meal.description,
                id: meal.id,
                isInDiet: meal.is_in_diet,
                name: meal.name,
                updatedAt: meal.updated_at,
                userId: meal.userId
            })

            return mealClass
        })

        return meals
    }

    async update(meal: Meal, tx: unknown): Promise<void> {
        const client = this.getClient(tx);
        const existMeal = await client.meals.findUnique({
            where: { id: meal.id }
        });

        if (existMeal === null) return

        await client.meals.update({
            where: {
                id: meal.id
            },
            data: {
                updated_at: meal.updatedAt,
                date: meal.date,
                description: meal.description,
                name: meal.name,
                is_in_diet: meal.isInDiet,
            }
        })
    }

    async findUserMeal(ownerId: string, mealId: string, tx: unknown): Promise<Meal | null> {
        const client = this.getClient(tx)
        const mealFound = await client.meals.findUnique({
            where: {
                id: mealId,
                userId: ownerId
            }
        })

        if (mealFound === null) return null

        const mealSchedule = CurrentDate.fromDate(mealFound.date)
        const meal = Meal.rehydrate({
            createdAt: mealFound.created_at,
            date: mealSchedule,
            description: mealFound.description,
            id: mealFound.id,
            isInDiet: mealFound.is_in_diet,
            name: mealFound.name,
            updatedAt: mealFound.updated_at,
            userId: mealFound.userId
        })

        return meal

    }

    async deleteMeal(mealId: string, tx: unknown): Promise<null> {
        const client = this.getClient(tx)
        await client.meals.delete({
            where: {
                id: mealId
            }
        })
        return null

    }

}