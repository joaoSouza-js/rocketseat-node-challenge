import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt'

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: string } // payload type is used for signing and verifying
        user: {
            "id": string
            "iat": number,
            "exp": number
        } // user type is return type of `request.user` object
    }
}