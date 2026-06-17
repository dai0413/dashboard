import {
  StaffMatchEventLogPopulatedSchema,
  StaffMatchEventLogPopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";
import { ResolvableEntity } from "./base.js";
import { Select } from "../select.js";

type Base = z.infer<typeof StaffMatchEventLogPopulatedSchema>;

type ResolveConfig = {
  match?: Select;
  team?: Select;
  match_event_type?: Select;
  staff?: Select;
};

type WithDefault<C extends ResolveConfig> = {
  match: C["match"] extends Select ? C["match"] : Select.LABEL;
  team: C["team"] extends Select ? C["team"] : Select.LABEL;
  match_event_type: C["match_event_type"] extends Select
    ? C["match_event_type"]
    : Select.LABEL;
  staff: C["staff"] extends Select ? C["staff"] : Select.LABEL;
};

export type ResolveInput<C extends ResolveConfig = {}> = Partial<
  Omit<Base, "match" | "team" | "match_event_type" | "staff"> & {
    match?: ResolvableEntity<Base, "match", WithDefault<C>["match"]>;
    team?: ResolvableEntity<Base, "team", WithDefault<C>["team"]>;
    match_event_type?: ResolvableEntity<
      Base,
      "match_event_type",
      WithDefault<C>["match_event_type"]
    >;
    staff?: ResolvableEntity<Base, "staff", WithDefault<C>["staff"]>;
  }
>;

export type ResolveOutput = Partial<
  z.infer<typeof StaffMatchEventLogPopulateLabelSchema>
>;
