export class Email {
    private constructor(private readonly email: string) { }

    static fromString(raw: string): Email {
        const rawWithoutSpaces = raw.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawWithoutSpaces)) throw new Error("Invalid email");
        return new Email(rawWithoutSpaces);
    }
    toString() { return this.email; }
}