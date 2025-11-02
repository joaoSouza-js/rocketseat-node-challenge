import type { FastifyInstance } from "fastify";
import { PrismaMealRepository } from "../../infrastructure/db/repositories/prisma-meal-user.repository";
import { CryptoIdGenerator } from "../../infrastructure/ids/crypto-id-generator";
import { PrismaUserRepository } from "../../infrastructure/db/repositories/prisma-user-repository";
import { RegisterMeal } from "../../application/use-cases/meals/register-meal";
import { PrismaUnitOfWork } from "../../infrastructure/db/prisma/prisma-unit-of-work";
import { makeRegisterMealHandler } from "../controllers/register-meal.controller";
import { prisma } from "../../infrastructure/db/prisma";
import { GetMeal } from "../../application/use-cases/meals/get-meal";
import { UpdateMeal } from "../../application/use-cases/meals/update-meal";
import { makeGetMealHandler } from "../controllers/get-meal.controller";
import { makeUpdateMealHandler } from "../controllers/update-meal.controller";
import { DeleteMeal } from "../../application/use-cases/meals/delete-meal";
import { GetMeals } from "../../application/use-cases/meals/get-meals";
import { makeDeleteMealHandler } from "../controllers/delete-meal.controller";
import { makeGetMealsHandler } from "../controllers/get-meals.controller";
import { GetMealsSummary } from "../../application/use-cases/meals/meals-summary";
import { makeGetMealsSummaryHandler } from "../controllers/get-meals.summary.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { RegisterMealBodySchema, RegisterMealSuccessResponse } from "../schemas/register-meal.http.schema";
import { GetMealQueryParamsSchema, GetMealSuccessResponseSchema } from "../schemas/get-meal.http.schema";
import { GetMealsSuccessResponse } from "../schemas/get-meals.http.schema";
import { DeleteMealQueryParamsSchema } from "../schemas/delete-meal.http.schema";
import { GetMealSummarySuccessResponse } from "../schemas/get-meal-summary.http";
import { UpdateMealSchema, UpdateMealSchemaParamsSchema } from "../schemas/update-meal.http.schema";

export async function mealRoutes(app: FastifyInstance) {
    const client = prisma
    const mealsRepository = new PrismaMealRepository(client)
    const usersRepository = new PrismaUserRepository(client)
    const uow = new PrismaUnitOfWork(client);
    const IdGenerator = new CryptoIdGenerator()
    const registerMealUC = new RegisterMeal(mealsRepository, usersRepository, IdGenerator, uow)
    const getMealUc = new GetMeal(mealsRepository, usersRepository, uow)
    const updateMealUc = new UpdateMeal(mealsRepository, usersRepository, uow)
    const deleteMealsUc = new DeleteMeal(mealsRepository, usersRepository, uow)
    const getMealsUc = new GetMeals(mealsRepository, usersRepository, uow)
    const getMealSummaryUc = new GetMealsSummary(mealsRepository, usersRepository, uow)

    app.addHook("onRequest", async (request, reply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })

    app.withTypeProvider<ZodTypeProvider>().post("/", {
        schema: {
            body: RegisterMealBodySchema,
            tags: ["meals"],
            summary: "register a meal",
            response: {
                201: RegisterMealSuccessResponse
            }
        }
    }, async (request, reply) => {
        const handler = await makeRegisterMealHandler({
            registerMeals: registerMealUC
        })
        await handler(request, reply)
    })

    app.withTypeProvider<ZodTypeProvider>().get("/", {
        schema: {
            tags: ["meals"],
            summary: "Get user meals",
            response: {
                200: GetMealsSuccessResponse
            }
        }
    }, async (request, reply) => {
        const handler = await makeGetMealsHandler({
            getMeals: getMealsUc
        })

        await handler(request, reply)
    })

    app.withTypeProvider<ZodTypeProvider>().get("/summary", {
        schema: {
            tags: ["meals"],
            summary: "Get meals summary",
            response: {
                200: GetMealSummarySuccessResponse
            }
        }
    }, async (request, reply) => {
        const handler = await makeGetMealsSummaryHandler({
            getMealsSummary: getMealSummaryUc
        })

        await handler(request, reply)
    })


    app.withTypeProvider<ZodTypeProvider>().get("/:id", {
        schema: {
            params: GetMealQueryParamsSchema,
            tags: ["meals"],
            summary: "Get a single meal.",
            response: {
                200: GetMealSuccessResponseSchema
            }
        }
    }, async (request, reply) => {
        const handler = await makeGetMealHandler({
            getMeal: getMealUc
        })

        await handler(request, reply)
    })


    app.withTypeProvider<ZodTypeProvider>().put("/:id", {
        schema: {
            tags: ["meals"],
            summary: 'Update a single meal.',
            body: UpdateMealSchema,
            params: UpdateMealSchemaParamsSchema,
        }
    }, async (request, reply) => {
        const handler = await makeUpdateMealHandler({
            updateMeal: updateMealUc
        })
        await handler(request, reply)
    })

    app.withTypeProvider<ZodTypeProvider>().delete("/:id", {
        schema: {
            params: DeleteMealQueryParamsSchema,
            tags: ["meals"],
            summary: "Delete a meal.",

        }
    }, async (request, reply) => {
        const handler = await makeDeleteMealHandler({
            deleteMeal: deleteMealsUc,
        })
        await handler(request, reply)
    })
}