import {
  StaffAppearancePopulatedSchema,
  StaffAppearancePopulateLabelSchema,
} from "@dai0413/myorg-shared";

import z from "zod";
import { ResolvableEntity } from "./base.js";
import { Select } from "../select.js";

type Base = z.infer<typeof StaffAppearancePopulatedSchema>;

type ResolveConfig = {
  match?: Select;
  staff?: Select;
  team?: Select;
};

type WithDefault<C extends ResolveConfig> = {
  match: C["match"] extends Select ? C["match"] : Select.LABEL;
  staff: C["staff"] extends Select ? C["staff"] : Select.LABEL;
  team: C["team"] extends Select ? C["team"] : Select.LABEL;
};

export type ResolveInput<C extends ResolveConfig = {}> = Partial<
  Omit<Base, "match" | "staff" | "team"> & {
    match?: ResolvableEntity<Base, "match", WithDefault<C>["match"]>;
    staff?: ResolvableEntity<Base, "staff", WithDefault<C>["staff"]>;
    team?: ResolvableEntity<Base, "team", WithDefault<C>["team"]>;
  }
>;

export type ResolveOutput = Partial<
  z.infer<typeof StaffAppearancePopulateLabelSchema>
>;
