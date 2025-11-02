import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { SignInUser } from "../../application/use-cases/users/sign-in";
import { PublicUserDTO } from "../../application/dto/user-dtos";
import { SignInBody } from "../schemas/sign-in-user.http.schema";

export async function makeRegisterSignInHandler(deps: { signUser: SignInUser }) {
    return async function signIn(
        request: FastifyRequest,
        reply: FastifyReply,
        app: FastifyInstance,
    ) {
        const { email, password } = request.body as SignInBody;

        const user = await deps.signUser.exec({ email, password });

        const userFormatted: PublicUserDTO = {
            id: user.id,
            name: user.name,
            email: user.email.toString(),
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        const token = app.jwt.sign({
            id: userFormatted.id
        }, {
            expiresIn: "7d"
        })


        return reply.status(200).send({
            user: userFormatted,
            token: token,
        });
    };
}
