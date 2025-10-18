import { Meal } from "../entities/meal"

interface MealsSummaryProps {
    amount: number
    mealInDiet: number
    mealOutDiet: number
    dietSequence: number // best consecutive in-diet streak (count)
}

export class MealSummary {
    constructor(private readonly props: MealsSummaryProps) { }

    static create(meals: Meal[]): MealSummary {
        let currentStreak = 0

        const summary = meals.reduce<MealsSummaryProps>(
            (acc, meal) => {
                acc.amount++

                if (meal.isInDiet) {
                    acc.mealInDiet++
                    currentStreak++
                    if (currentStreak > acc.dietSequence) {
                        acc.dietSequence = currentStreak
                    }
                } else {
                    acc.mealOutDiet++
                    currentStreak = 0
                }

                return acc
            },
            { amount: 0, mealInDiet: 0, mealOutDiet: 0, dietSequence: 0 },
        )

        return new MealSummary(summary)
    }

    static rehydrate(input: MealsSummaryProps): MealSummary {
        return new MealSummary(input)
    }

    get amount() {
        return this.props.amount
    }
    get mealOutDiet() {
        return this.props.mealOutDiet
    }
    get mealInDiet() {
        return this.props.mealInDiet
    }
    get dietSequence() {
        return this.props.dietSequence
    }
}
