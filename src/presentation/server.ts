import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "../config/env";
import { appRoutes } from "./routes/index.routes";
import { errorHandler } from "./error/error-handler";


const app = fastify({ logger: true })
app.register(appRoutes)
app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})
app.setErrorHandler(errorHandler)


export { app }