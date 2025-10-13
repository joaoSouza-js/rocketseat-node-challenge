import z from "zod";
import type { GetMeal } from "../../application/use-cases/meals/get-meal";
import type { FastifyReply, FastifyRequest } from "fastify";
import { isZodError } from "../utils/is-zod-error";
import { MealWrongOwner } from "../../domain/errors/meal-wrong-owner";
import { MealNotFoundError } from "../../domain/errors/meal-not-found.error";
import { UserNotFoundError } from "../../domain/errors/user-not-found.error";

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
        try {
            const meal = await deps.getMeal.exec({ mealId: id, ownerId: ownerId })
            return reply.send({
                meal: meal
            })
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
                message: "Unexpected error",
            });
        }

    }
}