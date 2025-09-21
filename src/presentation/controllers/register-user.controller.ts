// src/interface/http/users/register-user.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { RegisterUser } from "../../application/use-cases/users/register-user";
import { EmailAlreadyUsedError } from "../../domain/errors/email-already-used.error";

// Transport-level schema (loose; strips unknowns)
const bodySchema = z.object({
    name: z.string().min(1),
    email: z.string(),
    password: z.string().min(8),
}).strict(); // reject unknowns at the edge (optional choice)

type RegisterUserBody = z.infer<typeof bodySchema>;

export function makeRegisterUserHandler(deps: { registerUser: RegisterUser }) {
    return async function registerUser(
        request: FastifyRequest<{ Body: RegisterUserBody }>,
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

        try {
            // 2) Call application service
            const { id } = await deps.registerUser.exec({ name, email, password });

            // 3) Shape HTTP response
            // Resource URI is a choice; adapt to your routing strategy
            reply.header("Location", `/users/${id}`);
            return reply.status(201).send({
                id,
                name,
                email,
            });
        } catch (err: unknown) {
            // 4) Map domain/app errors → HTTP
            if (err instanceof EmailAlreadyUsedError) {
                return reply.status(409).send({
                    error: "Conflict",
                    message: err.message,
                });
            }

            // Zod from app layer?
            if (isZodError(err)) {
                return reply.status(422).send({
                    error: "UnprocessableEntity",
                    message: "Command validation failed",
                    issues: err.issues,
                });
            }

            // Unknown/unexpected → 500, but avoid leaking internals
            request.log?.error({ err }, "registerUser failed");
            return reply.status(500).send({
                error: "InternalServerError",
                message: "Unexpected error",
            });
        }
    };
}

// Small type guard so we don’t import Zod types in many places
function isZodError(e: any): e is { issues: unknown } {
    return e && typeof e === "object" && Array.isArray(e.issues);
}


