export class MealNotFoundError extends Error {
    constructor(readonly mealId: string) {
        super(`can not found meal with this id: ${mealId}`)
    }
}