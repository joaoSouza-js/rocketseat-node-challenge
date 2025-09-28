// src/infra/events/local-event-bus.ts
import type { EventPublisher } from "../../application/ports/event-publisher";

export class LocalEventBus implements EventPublisher {
    async publish(events: unknown[], tx?: unknown): Promise<void> {
        for (const ev of events) {
            // For now, just log. In real infra: push to queue, message bus, etc.
            console.log("[DomainEvent]", ev);
        }
    }
}
