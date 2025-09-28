// src/application/ports/unit-of-work.ts
export interface UnitOfWork<Ctx> {
    withTransaction<T>(fn: (ctx: Ctx) => Promise<T>): Promise<T>;
}

// App-facing context (Prisma-agnostic)
export type AppTxCtx = { tx: unknown };


// also you can make this
// export interface UnitOfWork<Ctx> {
//   withTransaction<T>(fn: (ctx: Ctx) => Promise<T>): Promise<T>;
// }
