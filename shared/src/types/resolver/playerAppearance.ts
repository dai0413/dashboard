import {
  PlayerAppearancePopulatedSchema,
  PlayerAppearancePopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";
import { ResolvableEntity } from "./base";
import { Select } from "../select";

type Base = z.infer<typeof PlayerAppearancePopulatedSchema>;

type ResolveConfig = {
  match?: Select;
  team?: Select;
  player?: Select;
};

type WithDefault<C extends ResolveConfig> = {
  match: C["match"] extends Select ? C["match"] : Select.LABEL;
  team: C["team"] extends Select ? C["team"] : Select.LABEL;
  player: C["player"] extends Select ? C["player"] : Select.LABEL;
};

export type ResolveInput<C extends ResolveConfig = {}> = Partial<
  Omit<Base, "match" | "team" | "player"> & {
    match?: ResolvableEntity<Base, "match", WithDefault<C>["match"]>;
    team?: ResolvableEntity<Base, "team", WithDefault<C>["team"]>;
    player?: ResolvableEntity<Base, "player", WithDefault<C>["player"]>;
  }
>;

export type ResolveOutput = Partial<
  z.infer<typeof PlayerAppearancePopulateLabelSchema>
>;
