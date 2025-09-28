import { input } from "zod";
import { CurrentDate } from "../value-objects/current-date";

interface MealProps {
    id: string;
    name: string;
    description: string;
    date: CurrentDate;
    userId: string;
    isInDiet: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface createMealProps {
    id: string;
    name: string;
    description: string;
    date: Date;
    userId: string;
    isInDiet: boolean;
}


export class Meal {
    private props: MealProps
    private constructor(props: MealProps) { this.props = props; }


    static create(
        input: createMealProps,
        updatedAt = new Date(),
        createdAt = new Date()) {

        const createDate = CurrentDate.fromDate(createdAt)
        const updateDate = CurrentDate.fromDate(updatedAt)
        const schedule = CurrentDate.fromDate(input.date)
        return new Meal({
            createdAt: createDate.toDate(),
            updatedAt: updateDate.toDate(),
            date: schedule,
            description: input.description,
            id: input.id,
            isInDiet: input.isInDiet,
            name: input.name,
            userId: input.userId
        })
    }
    static rehydrate(props: MealProps) {
        return new Meal(props)
    }

    get ownerId() { return this.props.userId }
    get id() { return this.props.id }
    get name() { return this.props.name }
    get date() { return this.props.date.toDate() }
    get description() { return this.props.description }
    get isInDiet() { return this.props.isInDiet }
    get createdAt() { return this.props.createdAt }
    get updatedAt() { return this.props.updatedAt }
}


