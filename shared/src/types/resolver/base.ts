import { Label } from "../label.js";
import { Select } from "../select.js";

type Resolvable<T, S extends Select> = S extends "Model" ? T : Label;

type Entity<Base, K extends keyof Base> = Base[K];

type PartialEntity<Base, K extends keyof Base> = Partial<Entity<Base, K>>;

export type ResolvableEntity<
  Base,
  K extends keyof Base,
  S extends Select,
> = Resolvable<PartialEntity<Base, K>, S>;
