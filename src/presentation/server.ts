import { userRoutes } from "./routes/users.routes";
import fastify from "fastify";


const app = fastify({ logger: true })
app.register(userRoutes)


export { app }