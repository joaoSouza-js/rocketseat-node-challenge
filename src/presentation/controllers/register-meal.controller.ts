import z from "zod";
import type { RegisterMeal } from "../../application/use-cases/meals/register-meal";
import type { FastifyReply, FastifyRequest } from "fastify";


const bodySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(8).max(255),
    date: z.coerce.date(),
    isInDiet: z.boolean(),
})

export async function makeRegisterMealHandler(deps: RegisterMeal) {
    return async function registerMeal(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const meal = bodySchema.parse(request.body);

        try {

            const mealId = await deps.exec({
                name: meal.name,
                date: meal.date,
                description: meal.description,
                isInDiet: meal.isInDiet,
                userId: ""
            });
            return reply.status(201).send({ mealId });
        }
        catch (error) {
            if (isZodError(error)) {
                return reply.status(422).send({
                    error: "UnprocessableEntity",
                    message: "Command validation failed",
                    issues: error.issues,
                });
            }
        }
    }
}


function isZodError(e: any): e is { issues: unknown } {
    return e && typeof e === "object" && Array.isArray(e.issues);
}
