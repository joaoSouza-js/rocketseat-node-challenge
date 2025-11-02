import type { FastifyInstance } from "fastify";
import { Argon2Hasher } from "../../infrastructure/crypto/argon-hasher";
import { CryptoIdGenerator } from "../../infrastructure/ids/crypto-id-generator";
import { prisma } from "../../infrastructure/db/prisma";
import { PrismaUserRepository } from "../../infrastructure/db/repositories/prisma-user-repository";
import { PrismaUnitOfWork } from "../../infrastructure/db/prisma/prisma-unit-of-work";
import { RegisterUser } from "../../application/use-cases/users/register-user";
import { LocalEventBus } from "../../infrastructure/events/local-event-bus";
import { makeRegisterUserHandler } from "../controllers/register-user.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { SignInUser } from "../../application/use-cases/users/sign-in";
import { makeRegisterSignInHandler } from "../controllers/sign-in.controller";
import { RegisterUserBodySchema } from "../schemas/register-user.http.schema";
import { SignInBodySchema, SignInSuccessType } from "../schemas/sign-in-user.http.schema";

export async function userRoutes(app: FastifyInstance) {
    const client = prisma

    const hasher = new Argon2Hasher();
    const ids = new CryptoIdGenerator()
    const users = new PrismaUserRepository(client)
    const uow = new PrismaUnitOfWork(client);
    const events = new LocalEventBus();

    const registerUserUC = new RegisterUser(users, hasher, ids, uow, events);
    const signInUc = new SignInUser(users, uow, hasher, events)
    app.withTypeProvider<ZodTypeProvider>().post("/", {

        schema: {
            tags: ["users"],
            summary: "create user",
            body: RegisterUserBodySchema
        }
    }, async (request, reply) => {
        const promiseHandler = await makeRegisterUserHandler({
            registerUser: registerUserUC
        })
        await promiseHandler(request, reply);

    })

    app.withTypeProvider<ZodTypeProvider>().post("/sign-in", {
        schema: {
            tags: ["users"],
            summary: "sign user ",
            body: SignInBodySchema,
            response: {
                200: SignInSuccessType
            }
        }
    }, async (request, reply) => {
        const promiseHandler = await makeRegisterSignInHandler({
            signUser: signInUc
        })
        await promiseHandler(request, reply, app);
    })
}