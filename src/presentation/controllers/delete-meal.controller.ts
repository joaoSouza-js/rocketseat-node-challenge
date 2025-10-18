import z from "zod"
import { DeleteMeal } from "../../application/use-cases/meals/delete-meal"
import type { FastifyReply, FastifyRequest } from "fastify";

const queryParamsSchema = z.object({
    id: z.string()
})


export async function makeDeleteMealHandler(deps: {
    deleteMeal: DeleteMeal
}) {
    return async function controller(request: FastifyRequest, reply: FastifyReply) {

        const { id } = queryParamsSchema.parse(request.params)
        const userId = request.user.id
        await deps.deleteMeal.exec({
            mealId: id,
            ownerId: userId
        })
        reply.send()

    }
}