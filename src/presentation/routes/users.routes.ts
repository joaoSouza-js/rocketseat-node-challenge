import type { FastifyInstance } from "fastify";
import { Argon2Hasher } from "../../infrastructure/crypto/argon-hasher";
import { CryptoIdGenerator } from "../../infrastructure/ids/crypto-id-generator";
import { prisma } from "../../infrastructure/db/prisma";
import { PrismaUserRepository } from "../../infrastructure/db/repositories/prisma-user-repository";
import { PrismaUnitOfWork } from "../../infrastructure/db/prisma/prisma-unit-of-work";
import { RegisterUser } from "../../application/use-cases/users/register-user";
import { LocalEventBus } from "../../infrastructure/events/local-event-bus";
import { makeRegisterUserHandler } from "../controllers/register-user.controller";

export async function userRoutes(app: FastifyInstance) {
    const client = prisma

    const hasher = new Argon2Hasher();
    const ids = new CryptoIdGenerator()
    const users = new PrismaUserRepository(client)
    const uow = new PrismaUnitOfWork(client);
    const events = new LocalEventBus();

    const registerUserUC = new RegisterUser(users, hasher, ids, uow, events);

    app.post("/", async (request, reply) => {
        const promiseHandler = await makeRegisterUserHandler({
            registerUser: registerUserUC
        })
        await promiseHandler(request, reply);

    })
}