import fastify, { FastifyInstance } from "fastify"
import { ZodError } from "zod"
import { BadRequest } from "./bad-request"
import { UserNotFoundError } from "../../domain/errors/user-not-found.error"
import { MealNotFoundError } from "../../domain/errors/meal-not-found.error"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {

    const isValidationError = error instanceof ZodError

    if (isValidationError) {
        return reply.status(400).send({
            message: `Error durring validation`,
            error: error.flatten().fieldErrors
        })
    }

    const isBadRequestError = error instanceof BadRequest
    const IsUserNotFoundError = error instanceof UserNotFoundError
    const iseMealNotFoundError = error instanceof MealNotFoundError

    if (isBadRequestError) {
        return reply.status(400).send({
            message: error.message
        })
    }


    if (IsUserNotFoundError) {
        return reply.status(409).send({
            error: "Conflict",
            message: error.message,
        });
    }
    if (iseMealNotFoundError) {
        return reply.status(409).send({
            error: "Conflict",
            message: error.message,
        });
    }
    return reply.status(500).send({ message: "Internal server error" })
}