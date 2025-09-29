import type { FastifyInstance } from "fastify";
import { userRoutes } from "./users.routes";
import { mealRoutes } from "./meals.routes";

export async function appRoutes(app: FastifyInstance) {
    app.register(userRoutes, { prefix: "/users" });
    app.register(mealRoutes, { prefix: "/meals" });

}