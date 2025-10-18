import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { RegisterUser } from "../../application/use-cases/users/register-user";
import { app } from "../server";

// Transport-level schema (loose; strips unknowns)
const bodySchema = z.object({
    name: z.string().min(1),
    email: z.string(),
    password: z.string().min(8),
}).strict(); // reject unknowns at the edge (optional choice)


export async function makeRegisterUserHandler(deps: { registerUser: RegisterUser }) {

    return async function registerUser(
        request: FastifyRequest,
        reply: FastifyReply
    ) {

        // 1) Parse/validate HTTP body (transport concerns)
        const parse = bodySchema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({
                error: "BadRequest",
                message: "Invalid request body",
                issues: parse.error.issues,
            });
        }
        const { name, email, password } = parse.data;

        const { id } = await deps.registerUser.exec({ name, email, password });

        const token = app.jwt.sign({
            id: id
        }, {
            expiresIn: "7d"
        })

        return reply.status(201).send({
            id,
            name,
            email,
            token
        });
    };
}

