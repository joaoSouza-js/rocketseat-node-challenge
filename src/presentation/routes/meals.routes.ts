import { PrismaClient } from "@prisma/client/extension";
import type { FastifyInstance } from "fastify";
import { PrismaMealRepository } from "../../infrastructure/db/repositories/prisma-meal-user.repository";
import { CryptoIdGenerator } from "../../infrastructure/ids/crypto-id-generator";
import { PrismaUserRepository } from "../../infrastructure/db/repositories/prisma-user-repository";
import { RegisterMeal } from "../../application/use-cases/meals/register-meal";
import { PrismaUnitOfWork } from "../../infrastructure/db/prisma/prisma-unit-of-work";
import { makeRegisterMealHandler } from "../controllers/register-meal.controller";

export async function MealRoutes(app: FastifyInstance) {
    const client = PrismaClient
    const mealsRepository = new PrismaMealRepository(client)
    const IdGenerator = new CryptoIdGenerator()
    const usersRepository = new PrismaUserRepository(client)
    const uow = new PrismaUnitOfWork(client);
    const registerMealUC = new RegisterMeal(mealsRepository, usersRepository, IdGenerator, uow)
    app.post("/meals", async (reply, response) => {
        const handler = await makeRegisterMealHandler(registerMealUC)
        await handler(reply, response)
    })
}