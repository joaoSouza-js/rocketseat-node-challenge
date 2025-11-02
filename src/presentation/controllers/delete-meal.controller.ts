import { DeleteMeal } from "../../application/use-cases/meals/delete-meal";
import type { FastifyReply, FastifyRequest } from "fastify";
import { DeleteMealQueryParams } from "../schemas/delete-meal.http.schema";

export async function makeDeleteMealHandler(deps: { deleteMeal: DeleteMeal }) {
    return async function controller(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { id } = request.params as DeleteMealQueryParams;
        const userId = request.user.id;
        await deps.deleteMeal.exec({
            mealId: id,
            ownerId: userId,
        });
        reply.send();
    };
}
