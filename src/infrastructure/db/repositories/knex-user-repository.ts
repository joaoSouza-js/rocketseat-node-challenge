import type { IUser } from "../../../application/repositories/iu-user-repository";
import type { User } from "../../../domain/entities/user";
import { mockUser } from "../../../placehoder/user-repository";

export class KnexUser implements IUser {
    async create(user: User): Promise<User> {
        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        // try to find
        const user = mockUser
        return user
    }

    async findById(id: string): Promise<User | null> {
        // try to find
        const user = mockUser
        return user
    }

    async update(user: User): Promise<User> {
        return user
    }
}