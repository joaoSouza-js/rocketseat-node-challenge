import { PastDateError } from "../errors/past-data.error"

export class CurrentDate {
    private static clock: () => Date = () => new Date()

    private constructor(private readonly value: Date) { }

    static fromDate(dateTime: Date): CurrentDate {
        const candidate = new Date(dateTime.getTime())
        CurrentDate.assertFuture(candidate)
        return new CurrentDate(candidate)
    }

    toDate(): Date {
        return new Date(this.value.getTime())
    }

    toISO(): string {
        return this.value.toISOString()
    }

    isPast(ref?: Date): boolean {
        const now = ref ? new Date(ref) : CurrentDate.clock()
        return this.value.getTime() <= now.getTime()
    }

    equals(other: CurrentDate): boolean {
        return this.value.getTime() === other.value.getTime()
    }

    private static assertFuture(candidate: Date) {
        const currentDate = CurrentDate.clock()
        const candidateTimestamp = candidate.getTime()
        const currentTimestamp = currentDate.getTime()
        const isInvalid = candidateTimestamp <= currentTimestamp
        if (isInvalid) {
            throw new PastDateError(currentDate)
        }
    }
}
