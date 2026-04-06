import {
  PlayerMatchEventLogPopulatedSchema,
  PlayerMatchEventLogPopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";
import { ResolvableEntity } from "./base";
import { Select } from "../select";

type Base = z.infer<typeof PlayerMatchEventLogPopulatedSchema>;

type ResolveConfig = {
  match?: Select;
  team?: Select;
  match_event_type?: Select;
  player?: Select;
};

type WithDefault<C extends ResolveConfig> = {
  match: C["match"] extends Select ? C["match"] : Select.LABEL;
  team: C["team"] extends Select ? C["team"] : Select.LABEL;
  match_event_type: C["match_event_type"] extends Select
    ? C["match_event_type"]
    : Select.LABEL;
  player: C["player"] extends Select ? C["player"] : Select.LABEL;
};

export type ResolveInput<C extends ResolveConfig = {}> = Partial<
  Omit<Base, "match" | "team" | "match_event_type" | "player"> & {
    match?: ResolvableEntity<Base, "match", WithDefault<C>["match"]>;
    team?: ResolvableEntity<Base, "team", WithDefault<C>["team"]>;
    match_event_type?: ResolvableEntity<
      Base,
      "match_event_type",
      WithDefault<C>["match_event_type"]
    >;
    player?: ResolvableEntity<Base, "player", WithDefault<C>["player"]>;
  }
>;

export type ResolveOutput = Partial<
  z.infer<typeof PlayerMatchEventLogPopulateLabelSchema>
>;
