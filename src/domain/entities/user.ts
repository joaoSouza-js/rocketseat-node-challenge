// src/domain/entities/user.ts
import { Email } from "../value-objects/email";

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  passwordHash: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;
  private constructor(props: UserProps) { this.props = props; }

  /** Factory for new users (enforces invariants) */
  static create(input: {
    id: string; name: string; email: string; passwordHash: string; imageUrl?: string;
  }, now = new Date()): User {
    if (!input.name?.trim()) throw new Error("Name is required");
    return new User({
      id: input.id,
      name: input.name.trim(),
      email: Email.fromString(input.email),
      passwordHash: input.passwordHash,
      imageUrl: input.imageUrl,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Rehydrate from persistence */
  static rehydrate(props: UserProps): User { return new User(props); }

  // getters – expose what the domain wants (not raw props)
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get imageUrl() { return this.props.imageUrl; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  get passwordHash() { return this.props.passwordHash; } // domain needs it; presentation never sees it

  changeEmail(next: string) {
    this.props.email = Email.fromString(next);
    this.touch();
  }

  private touch() { this.props.updatedAt = new Date(); }
}