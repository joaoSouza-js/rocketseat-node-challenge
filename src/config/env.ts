import z from "zod";
import 'dotenv/config'


export const configSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
})

export type Env = z.infer<typeof configSchema>


export const envSchema = configSchema.safeParse(process.env)

if (!envSchema.success) {
    console.error("Invalid environment variables", z.treeifyError(envSchema.error))
    throw new Error("Invalid environment variables")
}

export const env: Env = envSchema.data