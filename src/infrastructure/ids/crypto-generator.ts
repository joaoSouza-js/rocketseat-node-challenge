import { randomUUID } from "node:crypto"
import type { IdGenerator } from "../../application/ports/id-generator";

export class Generator implements IdGenerator {
    next(): string {
        const idGenerated = randomUUID()
        return idGenerated
    }
}