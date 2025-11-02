import type { FastifyReply, FastifyRequest } from "fastify";
import type { RegisterUser } from "../../application/use-cases/users/register-user";
import { RegisterUserBody } from "../schemas/register-user.http.schema";

export async function makeRegisterUserHandler(deps: { registerUser: RegisterUser }) {

    return async function registerUser(
        request: FastifyRequest,
        reply: FastifyReply
    ) {

        const { name, email, password } = request.body as RegisterUserBody

        const { id } = await deps.registerUser.exec({ name, email, password });

        return reply.status(201).send({
            id
        })
    };
}

