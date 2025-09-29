import type { FastifyInstance } from "fastify";
import { PrismaMealRepository } from "../../infrastructure/db/repositories/prisma-meal-user.repository";
import { CryptoIdGenerator } from "../../infrastructure/ids/crypto-id-generator";
import { PrismaUserRepository } from "../../infrastructure/db/repositories/prisma-user-repository";
import { RegisterMeal } from "../../application/use-cases/meals/register-meal";
import { PrismaUnitOfWork } from "../../infrastructure/db/prisma/prisma-unit-of-work";
import { makeRegisterMealHandler } from "../controllers/register-meal.controller";
import { prisma } from "../../infrastructure/db/prisma";

export async function mealRoutes(app: FastifyInstance) {
    const client = prisma
    const mealsRepository = new PrismaMealRepository(client)
    const IdGenerator = new CryptoIdGenerator()
    const usersRepository = new PrismaUserRepository(client)
    const uow = new PrismaUnitOfWork(client);
    const registerMealUC = new RegisterMeal(mealsRepository, usersRepository, IdGenerator, uow)

    app.addHook("onRequest", async (request, reply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })

    app.post("/", async (reply, response) => {
        const handler = await makeRegisterMealHandler({
            registerMeals: registerMealUC
        })
        await handler(reply, response)
    })
}