export interface EventPublisher {
    publish(events: unknown[], tx?: unknown): Promise<void>;
}