import {
  TeamMatchFormationPopulatedSchema,
  TeamMatchFormationPopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";
import { ResolvableEntity } from "./base.js";
import { Select } from "../select.js";

type Base = z.infer<typeof TeamMatchFormationPopulatedSchema>;

type ResolveConfig = {
  match?: Select;
  team?: Select;
  formation?: Select;
};

type WithDefault<C extends ResolveConfig> = {
  match: C["match"] extends Select ? C["match"] : Select.LABEL;
  team: C["team"] extends Select ? C["team"] : Select.LABEL;
  formation: C["formation"] extends Select ? C["formation"] : Select.LABEL;
};

export type ResolveInput<C extends ResolveConfig = {}> = Partial<
  Omit<Base, "match" | "team" | "formation"> & {
    match?: ResolvableEntity<Base, "match", WithDefault<C>["match"]>;
    team?: ResolvableEntity<Base, "team", WithDefault<C>["team"]>;
    formation?: ResolvableEntity<
      Base,
      "formation",
      WithDefault<C>["formation"]
    >;
  }
>;

export type ResolveOutput = Partial<
  z.infer<typeof TeamMatchFormationPopulateLabelSchema>
>;
