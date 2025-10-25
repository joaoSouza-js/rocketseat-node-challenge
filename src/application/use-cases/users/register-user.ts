import { User } from "../../../domain/entities/user"
import type { Hasher } from "../../ports/hasher"
import type { IdGenerator } from "../../ports/id-generator"
import type { AppTxCtx, UnitOfWork } from "../../ports/unit-of-work"
import type { EventPublisher } from "../../ports/event-publisher"
import type { UserRepository } from "../../../domain/repositories/iu-user-repository"
import { EmailAlreadyUsedError } from "../../../domain/errors/email-already-used.error"


export type RegisterUserCommand = {
    name: string;
    email: string;
    password: string;
};


export class RegisterUser {

    constructor(
        private readonly users: UserRepository,
        private readonly hasher: Hasher,
        private readonly ids: IdGenerator,
        private readonly uow: UnitOfWork<AppTxCtx>,
        private readonly events: EventPublisher
    ) { }

    async exec(input: RegisterUserCommand): Promise<{ id: string }> {


        return this.uow.withTransaction(async ({ tx }) => {
            const existing = await this.users.findByEmail(input.email, tx);
            if (existing) {
                throw new EmailAlreadyUsedError(input.email);
            }

            const id = this.ids.next();
            const passwordHash = await this.hasher.hash(input.password);

            const user = User.create({
                id,
                email: input.email,
                name: input.name,
                passwordHash,
            });

            await this.users.create(user, tx);
            //await this.events.publish([new UserRegistered(user.id)], tx);

            return { id };
        });
    }
}
