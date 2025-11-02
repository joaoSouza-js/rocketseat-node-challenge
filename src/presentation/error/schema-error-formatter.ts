// src/presentation/errors/schema-error-formatter.ts
import type { SchemaErrorFormatter } from "fastify/types/schema";
import type { ZodError } from "zod";

type Payload = {
    error: "BadRequest";
    message: string;
    issues: {
        fieldErrors?: Record<string, string[]>;
        formErrors?: string[];
    } | unknown;
};

export const schemaErrorFormatter: SchemaErrorFormatter = (errors, _dataVar) => {
    // fastify-type-provider-zod puts the ZodError in params.zodError of the first error
    const zerr = (errors[0] as any)?.params?.zodError as ZodError | undefined;

    const e = new Error("Validation failed");
    (e as any).statusCode = 400;

    const payload: Payload = {
        error: "BadRequest",
        message: "Validation failed",
        issues: zerr
            ? { fieldErrors: zerr.flatten().fieldErrors, formErrors: zerr.flatten().formErrors }
            : errors, // fallback for non-Zod schemas
    };

    (e as any).payload = payload;
    return e;
};
