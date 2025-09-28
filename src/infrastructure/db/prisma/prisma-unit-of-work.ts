// src/infra/db/prisma-unit-of-work.ts
import type { UnitOfWork } from "../../../application/ports/unit-of-work";
import type { PrismaClient, Prisma } from "../../../../generated/prisma"

export type PrismaTxCtx = { tx: Prisma.TransactionClient };

export class PrismaUnitOfWork implements UnitOfWork<PrismaTxCtx> {
    constructor(private readonly prisma: PrismaClient) { }
    async withTransaction<T>(
        fn: (ctx: { tx: Prisma.TransactionClient }) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            return fn({ tx })
        });
    }
}
