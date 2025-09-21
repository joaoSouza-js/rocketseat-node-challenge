export type RegisterUserCommand = {
    name: string;
    email: string;
    password: string;
    imageUrl?: string;
};

export type PublicUserDTO = {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
};