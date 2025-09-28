// src/infra/db/prisma-user-repository.ts
import type { PrismaClient, Prisma } from "../../../../generated/prisma";
import { User } from "../../../domain/entities/user";
import type { UserRepository } from "../../../domain/repositories/iu-user-repository";
import { Email } from "../../../domain/value-objects/email";

// A minimal "shape" both PrismaClient and TransactionClient share.
// Add more delegates (tables) here if this repo uses them.
type DbClient = Pick<PrismaClient, "user">;

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    private getClient(tx?: Prisma.TransactionClient): DbClient {
        // Both PrismaClient and TransactionClient have the same model delegates.
        return (tx ?? this.prisma) as DbClient;
    }

    async findByEmail(email: string, tx?: Prisma.TransactionClient): Promise<User | null> {
        const client = this.getClient(tx);

        const record = await client.user.findUnique({ where: { email } });
        if (!record) return null;

        return User.rehydrate({
            id: record.id,
            name: record.name,
            email: Email.fromString(record.email),
            passwordHash: record.password,       // ← your column names
            imageUrl: record.image_url ?? undefined, // if you have it
            createdAt: record.created_at,        // ← your column names
            updatedAt: record.updated_at,
        });
    }

    async findById(id: string, tx?: Prisma.TransactionClient): Promise<User | null> {
        const client = this.getClient(tx);

        const record = await client.user.findUnique({ where: { id } });
        if (!record) return null;

        return User.rehydrate({
            id: record.id,
            name: record.name,
            email: Email.fromString(record.email),
            passwordHash: record.password,
            imageUrl: record.image_url ?? undefined, // if you have it
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        });
    }

    async create(user: User, tx?: Prisma.TransactionClient): Promise<void> {
        const client = this.getClient(tx);

        await client.user.create({
            data: {
                id: user.id,
                email: user.email.toString(),
                name: user.name,
                password: user.passwordHash,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            },
        });
    }

    async update(user: User, tx?: Prisma.TransactionClient): Promise<void> {
        const client = this.getClient(tx);

        await client.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                email: user.email.toString(),
                password: user.passwordHash,
                updated_at: new Date(),
            },
        });
    }
}
