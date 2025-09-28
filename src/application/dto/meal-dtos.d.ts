export interface RegisterMealCommand {
    userId: string,
    name: string,
    description: string,
    isInDiet: boolean,
    date: Date,

}

export interface PublicMealDTO {
    id: string;
    name: string;
    description: string;
    date: Date;
    ownerId?: string;
    isInDiet: boolean;
}