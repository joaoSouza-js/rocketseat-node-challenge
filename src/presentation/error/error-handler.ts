// src/presentation/errors/error-handler.ts
import type { FastifyInstance } from "fastify";
import { BadRequest } from "./bad-request";
import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import { MealNotFoundError } from "../../domain/errors/meal-not-found.error";
import { UserIncorrectCredentials } from "../../domain/errors/user-incorrect-credentials";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, req, reply) => {
    // 400s produced by schemaErrorFormatter
    const payload = (error as any).payload;
    const statusFromFormatter = (error as any).statusCode;
    if (payload && statusFromFormatter === 400) {
        return reply.status(400).send(payload);
    }

    // Validation error without formatter (fallback) – detect via Fastify code
    if ((error as any).code === "FST_ERR_VALIDATION") {
        // Try to grab the ZodError cause if available
        const cause = (error as any).cause as { flatten?: () => any } | undefined;
        if (cause?.flatten) {
            const flat = cause.flatten();
            return reply.status(400).send({
                error: "BadRequest",
                message: "Validation failed",
                issues: { fieldErrors: flat.fieldErrors, formErrors: flat.formErrors },
            });
        }
        return reply.status(400).send({
            error: "BadRequest",
            message: "Validation failed",
            issues: (error as any).validation ?? [],
        });
    }

    // Application/Domain mapping
    if (error instanceof BadRequest) {
        return reply.status(400).send({ error: "BadRequest", message: error.message });
    }

    if (error instanceof UserNotFoundError || error instanceof MealNotFoundError) {
        return reply.status(409).send({ error: "Conflict", message: error.message });
    }

    if (error instanceof UserIncorrectCredentials) {
        return reply.status(401).send({ error: "Conflict", message: error.message });

    }

    // Default 500
    req.log.error({ error }, "Unhandled error");
    return reply.status(500).send({
        error: "InternalServerError",
        message: process.env.NODE_ENV === "production" ? "Something went wrong" : error.message,
    });
};
