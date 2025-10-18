export interface RegisterMealCommand {
    userId: string,
    name: string,
    description: string,
    isInDiet: boolean,
    date: Date,
}

export interface UpdateMealCommand {
    mealId: string,
    ownerId: string,
    name?: string,
    description?: string,
    isInDiet?: boolean,
    date?: Date,
}

export interface GetMealCommand {
    ownerId: string,
    mealId: string,
}

export interface GetMealsCommand {
    ownerId: string,
}

export interface DeleteMealCommand {
    ownerId: string,
    mealId: string
}

export interface PublicMealDTO {
    id: string;
    name: string;
    description: string;
    date: Date;
    ownerId?: string;
    isInDiet: boolean;
}