import * as argon2 from "argon2";
import type { Hasher } from "../../application/ports/hasher";


export class Argon2Hasher implements Hasher {

    hash(plain: string): Promise<string> {
        const hashedPromise = argon2.hash(plain)
        return hashedPromise
    }

    compare(plain: string, hash: string): Promise<boolean> {
        const comparePromise = argon2.verify(hash, plain)
        return comparePromise
    }
}