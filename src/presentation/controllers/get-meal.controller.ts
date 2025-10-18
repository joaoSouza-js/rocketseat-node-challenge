import z from "zod";
import type { GetMeal } from "../../application/use-cases/meals/get-meal";
import type { FastifyReply, FastifyRequest } from "fastify";

const queryParams = z.object({
    id: z.string()
})

export async function makeGetMealHandler(
    deps: {
        getMeal: GetMeal
    }
) {
    return async function getMealController(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { id } = queryParams.parse(request.params)
        const ownerId = request.user.id
        const meal = await deps.getMeal.exec({ mealId: id, ownerId: ownerId })
        return reply.send({
            meal: meal
        })

    }
}