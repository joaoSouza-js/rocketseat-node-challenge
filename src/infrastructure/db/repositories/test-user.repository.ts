// src/infra/db/mock-user-repository.ts
import { User } from "../../../domain/entities/user";
import type { UserRepository } from "../../../domain/repositories/iu-user-repository";
import { Email } from "../../../domain/value-objects/email";

export class MockUserRepository implements UserRepository {
    private users: Map<string, User> = new Map();

    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email.toString().match(email)) {
                return user;
            }
        }
        return null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) ?? null;
    }

    async create(user: User): Promise<void> {
        console.log(user.email)
        this.users.set(user.id, user);
    }

    async update(user: User): Promise<void> {
        if (!this.users.has(user.id)) {
            throw new Error(`User with id ${user.id} not found`);
        }
        this.users.set(user.id, user);
    }
}
