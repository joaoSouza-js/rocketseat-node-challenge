import { FastifyError } from "fastify";
import { env } from "./config/env";
import { app } from "./presentation/server";

app.listen({
    host: "0.0.0.0",
    port: env.PORT
}, (error) => {

    if (!error) {
        console.log(`server is running on http://localhost:${env.PORT}`)
        return
    }
    console.log(error.message)
});