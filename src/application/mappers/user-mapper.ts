import type { User } from "../../domain/entities/user";
import type { PublicUserDTO } from "../dto/user-dtos";

export function toPublicUserDTO(user: User): PublicUserDTO {
    const publicUser: PublicUserDTO = {
        createdAt: user.createdAt,
        email: user.email.toString(),
        id: user.id,
        name: user.name,
        updatedAt: user.updatedAt,
        imageUrl: user.imageUrl,
    }

    return publicUser
}