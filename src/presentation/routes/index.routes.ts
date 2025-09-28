import type { FastifyInstance } from "fastify";
import { userRoutes } from "./users.routes";

export function appRoutes(app: FastifyInstance) {
    userRoutes(app)
}