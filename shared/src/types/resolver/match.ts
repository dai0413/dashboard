import {
  MatchPopulatedSchema,
  MatchPopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";
import { ResolvableEntity } from "./base";
import { Select } from "../select";

type Base = z.infer<typeof MatchPopulatedSchema>;

type ResolveConfig = {
  competition?: Select;
  competition_stage?: Select;
  season?: Select;
  home_team?: Select;
  away_team?: Select;
  match_format?: Select;
  stadium?: Select;
};

type WithDefault<C extends ResolveConfig> = {
  competition: C["competition"] extends Select
    ? C["competition"]
    : Select.LABEL;
  competition_stage: C["competition_stage"] extends Select
    ? C["competition_stage"]
    : Select.LABEL;
  season: C["season"] extends Select ? C["season"] : Select.LABEL;
  home_team: C["home_team"] extends Select ? C["home_team"] : Select.LABEL;
  away_team: C["away_team"] extends Select ? C["away_team"] : Select.LABEL;
  match_format: C["match_format"] extends Select
    ? C["match_format"]
    : Select.LABEL;
  stadium: C["stadium"] extends Select ? C["stadium"] : Select.LABEL;
};

export type ResolveInput<C extends ResolveConfig = {}> = Partial<
  Omit<
    Base,
    | "competition"
    | "competition_stage"
    | "season"
    | "home_team"
    | "away_team"
    | "match_format"
    | "stadium"
  > & {
    competition?: ResolvableEntity<
      Base,
      "competition",
      WithDefault<C>["competition"]
    >;
    competition_stage?: ResolvableEntity<
      Base,
      "competition_stage",
      WithDefault<C>["competition_stage"]
    >;
    season?: ResolvableEntity<Base, "season", WithDefault<C>["season"]>;
    home_team?: ResolvableEntity<
      Base,
      "home_team",
      WithDefault<C>["home_team"]
    >;
    away_team?: ResolvableEntity<
      Base,
      "away_team",
      WithDefault<C>["away_team"]
    >;
    match_format?: ResolvableEntity<
      Base,
      "match_format",
      WithDefault<C>["match_format"]
    >;
    stadium?: ResolvableEntity<Base, "stadium", WithDefault<C>["stadium"]>;
  }
>;

export type ResolveOutput = Partial<z.infer<typeof MatchPopulateLabelSchema>>;
