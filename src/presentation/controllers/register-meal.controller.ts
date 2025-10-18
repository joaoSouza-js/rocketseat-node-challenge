import z from "zod";
import type { RegisterMeal } from "../../application/use-cases/meals/register-meal";
import type { FastifyReply, FastifyRequest } from "fastify";

const bodySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(8).max(255),
    date: z.coerce.date(),
    isInDiet: z.coerce.boolean().default(false),
})

export async function makeRegisterMealHandler(deps: {
    registerMeals: RegisterMeal
}) {
    return async function registerMeal(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const meal = bodySchema.parse(request.body);

        const mealId = await deps.registerMeals.exec({
            name: meal.name,
            date: meal.date,
            description: meal.description,
            isInDiet: meal.isInDiet,
            userId: request.user.id
        });

        return reply.status(201).send({ id: mealId });
    }
}

