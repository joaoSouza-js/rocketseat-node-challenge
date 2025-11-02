import { z } from "zod";
export const RegisterUserBodySchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
}).strict(); // reject unknowns at the edge (optional choice)

export type RegisterUserBody = z.infer<typeof RegisterUserBodySchema>;
