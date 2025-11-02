export class UserIncorrectCredentials extends Error {
    constructor() {
        super(`User credentials are wrong.`);
    }
}