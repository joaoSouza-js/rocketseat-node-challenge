import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "../config/env";
import { appRoutes } from "./routes/index.routes";
import { errorHandler } from "./error/error-handler";
import {
    jsonSchemaTransform,
    createJsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod'; import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import { schemaErrorFormatter } from "./error/schema-error-formatter";


const app = fastify({ logger: true })
app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})
app.setErrorHandler(errorHandler);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'SampleApi',
            description: 'Sample backend service',
            version: '1.0.0',
        },
        servers: [],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", // <- optional, UI display only
                },
            },
        },
        security: [{ bearerAuth: [] }], // <= GLOBAL requirement (critical)
    },
    transform: jsonSchemaTransform,

});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

app.register(appRoutes)




export { app }