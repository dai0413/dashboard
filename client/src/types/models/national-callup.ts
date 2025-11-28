import { leftReason, positionGroup, status } from "@myorg/shared";
import { Label } from "../types";
import { NationalMatchSeries } from "./national-match-series";
import { Player } from "./player";
import { Team } from "./team";

const StatusOptions = status().map((item) => item.key);
const PositionGroupOptions = positionGroup().map((item) => item.key);
const LeftReasonOptions = leftReason().map((item) => item.key);

type Status = (typeof StatusOptions)[number] | null;
type PositionGroup = (typeof PositionGroupOptions)[number] | null;
type LeftReason = (typeof LeftReasonOptions)[number] | null;

export type NationalCallup = {
  _id: string;
  series: NationalMatchSeries;
  player: Player;
  team: Team;
  team_name: string | null;
  joined_at: Date | null;
  left_at: Date | null;
  number: number | null;
  position_group: PositionGroup;
  is_captain: boolean;
  is_overage: boolean;
  is_backup: boolean;
  is_training_partner: boolean;
  is_additional_call: boolean;
  status: Status;
  left_reason: LeftReason;
};

type NationalCallupPost = Omit<
  NationalCallup,
  "_id" | "series" | "player" | "team" | "joined_at" | "left_at"
> & {
  series: NationalMatchSeries["_id"];
  player: Player["_id"];
  team: Team["_id"];
  joined_at: string | null;
  left_at: string | null;
};

export type NationalCallupForm = Partial<NationalCallupPost>;

export type NationalCallupGet = Omit<
  NationalCallup,
  "series" | "player" | "team"
> & {
  series: Label;
  player: Label;
  team: Label;
};
