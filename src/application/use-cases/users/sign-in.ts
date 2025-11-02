import { User } from "../../../domain/entities/user"
import type { Hasher } from "../../ports/hasher"
import type { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work"
import type { EventPublisher } from "../../ports/event-publisher"
import type { UserRepository } from "../../../domain/repositories/iu-user-repository"
import { UserNotFoundError } from "../../../domain/errors/user-not-found.error"
import { UserIncorrectCredentials } from "../../../domain/errors/user-incorrect-credentials"


export type RegisterSigninCommand = {
    email: string;
    password: string;
};


export class SignInUser {

    constructor(
        private readonly users: UserRepository,
        private readonly uow: UnitOfWork<AppTxCtx>,
        private readonly hasher: Hasher,
        private readonly events: EventPublisher
    ) { }

    async exec(input: RegisterSigninCommand): Promise<User> {


        return this.uow.withTransaction(async ({ tx }) => {
            const useExist = await this.users.findByEmail(input.email, tx);
            if (!useExist) {
                throw new UserNotFoundError(input.email);
            }

            const isCorrectPassword = await this.hasher.compare(input.password, useExist.passwordHash)

            if (isCorrectPassword === false) {
                throw new UserIncorrectCredentials()
            }

            return useExist
        });
    }
}
