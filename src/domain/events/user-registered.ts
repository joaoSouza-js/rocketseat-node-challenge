export class userRegistered {
    constructor(
        public readonly userid: string,
        public readonly occurredAt: Date = new Date()
    ) { }
}