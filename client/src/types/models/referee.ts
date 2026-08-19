import { Label } from "../types";
import { Player } from "./player";
import { Country } from "./country";
import {
  RefereeFormSchema,
  RefereePopulatedSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

export type Referee = Omit<
  z.infer<typeof RefereePopulatedSchema>,
  "citizenship" | "player"
> & {
  citizenship?: Country[];
  player?: Player;
};

export type RefereeForm = Partial<
  Omit<z.infer<typeof RefereeFormSchema>, "citizenship" | "player" | "dob"> & {
    citizenship?: Country["_id"][];
    player?: Player["_id"];
    dob?: string;
  }
>;

export type RefereeGet = Omit<Referee, "player" | "citizenship"> & {
  player?: Label;
  citizenship: Label[];
};
