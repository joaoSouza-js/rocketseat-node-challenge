export interface UnitOfWork {
    withTransaction<T>(fn: (ctx: { tx: unknown }) => Promise<T>): Promise<T>;
}