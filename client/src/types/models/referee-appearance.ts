import {
  RefereeAppearancePopulatedSchema,
  RefereeAppearanceFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Match } from "./match";
import { Referee } from "./referee";

export type RefereeAppearance = Omit<
  z.infer<typeof RefereeAppearancePopulatedSchema>,
  "match" | "referee"
> & {
  match: Match;
  referee: Referee;
};

export type RefereeAppearanceForm = Partial<
  Omit<z.infer<typeof RefereeAppearanceFormSchema>, "match" | "referee"> & {
    match: Match["_id"];
    referee: Referee["_id"];
  }
>;

export type RefereeAppearanceGet = Omit<
  RefereeAppearance,
  "match" | "referee"
> & {
  match: Label;
  referee: Label;
};
