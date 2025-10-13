export class MealWrongOwner extends Error {
    constructor(mealId: string) {
        super(`you can't realize any operation in meal with id: ${mealId} `)
    }
}