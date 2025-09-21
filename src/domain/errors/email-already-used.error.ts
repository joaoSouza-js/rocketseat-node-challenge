export class EmailAlreadyUsedError extends Error {
    constructor(email: string) {
        super(`Email already in use: ${email}`);
        this.name = "EmailAlreadyUsedError";
    }
}