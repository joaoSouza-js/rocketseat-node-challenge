import type { FastifyReply, FastifyRequest } from "fastify";
import { GetMealsSummary } from "../../application/use-cases/meals/meals-summary";

export async function makeGetMealsSummaryHandler(deps: {
    getMealsSummary: GetMealsSummary
}) {

    return async function controller(request: FastifyRequest, reply: FastifyReply) {
        const ownerId = request.user.id
        const meals = await deps.getMealsSummary.exec({ ownerId: ownerId })
        reply.send({
            meals: meals
        })
    }
} 