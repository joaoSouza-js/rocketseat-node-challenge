import { z } from "zod"
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



const cmdSchema = z.object({
    name: z.string().trim().min(1),
    email: z.string(),
    password: z.string().min(8),
});

export class RegisterUser {
    constructor(
        private readonly users: UserRepository,
        private readonly hasher: Hasher,
        private readonly ids: IdGenerator,
        private readonly uow: UnitOfWork<AppTxCtx>,
        private readonly events: EventPublisher
    ) { }

    async exec(input: RegisterUserCommand): Promise<{ id: string }> {
        const cmd = cmdSchema.parse(input);

        return this.uow.withTransaction(async ({ tx }) => {
            const existing = await this.users.findByEmail(cmd.email, tx);
            if (existing) {
                throw new EmailAlreadyUsedError(cmd.email);
            }

            const id = this.ids.next();
            const passwordHash = await this.hasher.hash(cmd.password);

            const user = User.create({
                id,
                email: cmd.email,
                name: cmd.name,
                passwordHash,
            });

            await this.users.create(user, tx);
            //await this.events.publish([new UserRegistered(user.id)], tx);

            return { id };
        });
    }
}
