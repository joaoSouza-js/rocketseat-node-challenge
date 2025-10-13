export function isZodError(e: any): e is { issues: unknown } {
    return e && typeof e === "object" && Array.isArray(e.issues);
}

