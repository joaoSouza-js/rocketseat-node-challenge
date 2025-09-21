import { FastifyInstance } from "fastify";
import { Argon2Hasher } from "../../infrastructure/crypto/argon-hasher";

export function userRoutes(app: FastifyInstance) {
    const hasher = new Argon2Hasher();

    app.post("/users", () => {

    })
}