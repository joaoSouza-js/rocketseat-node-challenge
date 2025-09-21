import type { User } from "../entities/user";

export interface UserRepository {
    create(user: User, tx?: unknown): Promise<void>;
    update(user: User, tx?: unknown): Promise<void>;
    findByEmail(email: string, tx?: unknown): Promise<User | null>;
    findById(id: string, tx?: unknown): Promise<User | null>;
}