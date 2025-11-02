import { z, ZodType } from "zod";
import { PublicUserDTO } from "../../application/dto/user-dtos";
export const SignInBodySchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
}).strict(); // reject unknowns at the edge (optional choice)


type SignInSuccessType = {
    user: PublicUserDTO,
    token: string,
}

export const SignInSuccessType = z.object({
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        imageUrl: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
    }),
    token: z.string()
}) satisfies ZodType<SignInSuccessType>

export type SignInBody = z.infer<typeof SignInBodySchema>;
