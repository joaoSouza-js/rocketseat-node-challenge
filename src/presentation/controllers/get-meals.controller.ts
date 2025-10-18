import z from "zod";
import type { GetMeals } from "../../application/use-cases/meals/get-meals";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function makeGetMealsHandler(deps: {
    getMeals: GetMeals
}) {

    return async function controller(request: FastifyRequest, reply: FastifyReply) {
        const ownerId = request.user.id
        const meals = await deps.getMeals.exec({ ownerId: ownerId })
        reply.send({
            meals: meals
        })
    }
} 