export class PastDateError extends Error {
    constructor(date: Date, allowEqualNow = true) {
        const rule = allowEqualNow ? ">= now" : "> now"
        super(`Date/time has already passed: ${date.toISOString()} rule ${rule}`);
        this.name = "PastDateError";
    }
}
