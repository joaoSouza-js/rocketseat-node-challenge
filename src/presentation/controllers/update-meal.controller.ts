import z from "zod";
import type { UpdateMeal } from "../../application/use-cases/meals/update-meal";
import type { FastifyReply, FastifyRequest } from "fastify";
import { isZodError } from "../utils/is-zod-error";
import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import { MealNotFoundError } from "../../domain/errors/meal-not-found.error";
import { MealWrongOwner } from "../../domain/errors/meal-wrong-owner";

const bodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(8).max(255).optional(),
    date: z.coerce.date().optional(),
    isInDiet: z.coerce.boolean().default(false).optional()

})

const queryParams = z.object({
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
        const { id } = queryParams.parse(request.params)
        const userId = request.user.id


        try {
            await dependencies.updateMeal.exec({
                name: meal.name,
                mealId: id,
                ownerId: userId,
                date: meal.date,
                description: meal.description,
                isInDiet: meal.isInDiet
            })

            reply.status(200)
        } catch (error: unknown) {
            // 4) Map domain/app errors → HTTP
            if (error instanceof UserNotFoundError) {
                return reply.status(409).send({
                    error: "Conflict",
                    message: error.message,
                });
            }
            if (error instanceof MealNotFoundError) {
                return reply.status(409).send({
                    error: "Conflict",
                    message: error.message,
                });
            }
            if (error instanceof MealWrongOwner) {
                return reply.status(409).send({
                    error: "Conflict",
                    message: error.message,
                });
            }


            // Zod from app layer?
            if (isZodError(error)) {
                return reply.status(422).send({
                    error: "UnprocessableEntity",
                    message: "Command validation failed",
                    issues: error.issues,
                });
            }

            // Unknown/unexpected → 500, but avoid leaking internals
            request.log?.error({ error }, "registerUser failed");
            return reply.status(500).send({
                error: "InternalServerError",
                message: error,
            });
        }



    }
}