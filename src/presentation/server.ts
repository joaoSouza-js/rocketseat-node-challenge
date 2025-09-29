import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./routes/users.routes";
import fastify from "fastify";
import { env } from "../config/env";
import { appRoutes } from "./routes/index.routes";


const app = fastify({ logger: true })
app.register(appRoutes)
app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})


export { app }