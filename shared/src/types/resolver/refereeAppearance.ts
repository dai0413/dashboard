import {
  RefereeAppearancePopulatedSchema,
  RefereeAppearancePopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";
import { ResolvableEntity } from "./base.js";
import { Select } from "../select.js";

type Base = z.infer<typeof RefereeAppearancePopulatedSchema>;

type ResolveConfig = {
  match?: Select;
  referee?: Select;
};

type WithDefault<C extends ResolveConfig> = {
  match: C["match"] extends Select ? C["match"] : Select.LABEL;
  referee: C["referee"] extends Select ? C["referee"] : Select.LABEL;
};

export type ResolveInput<C extends ResolveConfig = {}> = Partial<
  Omit<Base, "match" | "referee"> & {
    match?: ResolvableEntity<Base, "match", WithDefault<C>["match"]>;
    referee?: ResolvableEntity<Base, "referee", WithDefault<C>["referee"]>;
  }
>;

export type ResolveOutput = Partial<
  z.infer<typeof RefereeAppearancePopulateLabelSchema>
>;
