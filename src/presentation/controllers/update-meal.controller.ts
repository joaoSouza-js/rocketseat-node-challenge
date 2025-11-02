import z from "zod";
import type { UpdateMeal } from "../../application/use-cases/meals/update-meal";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UpdateMealBody, UpdateMealSchemaParams } from "../schemas/update-meal.http.schema";



export async function makeUpdateMealHandler(dependencies: {
    updateMeal: UpdateMeal
}) {
    return async function updateMealController(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const meal = request.body as UpdateMealBody
        const { id } = request.params as UpdateMealSchemaParams
        const userId = request.user.id

        await dependencies.updateMeal.exec({
            name: meal.name,
            mealId: id,
            ownerId: userId,
            date: meal.date,
            description: meal.description,
            isInDiet: meal.isInDiet
        })

        return reply.status(200)

    }
}