import z from "zod";
import type { UpdateMeal } from "../../application/use-cases/meals/update-meal";
import type { FastifyReply, FastifyRequest } from "fastify";

const bodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(8).max(255).optional(),
    date: z.coerce.date().optional(),
    isInDiet: z.coerce.boolean().default(false).optional()

})

const queryParamsSchema = z.object({
    id: z.string()
})

export async function makeUpdateMealHandler(dependencies: {
    updateMeal: UpdateMeal
}) {
    return async function updateMealController(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const meal = bodySchema.parse(request.body)
        const { id } = queryParamsSchema.parse(request.params)
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