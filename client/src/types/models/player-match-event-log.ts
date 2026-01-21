import {
  PlayerMatchEventLogPopulatedSchema,
  PlayerMatchEventLogFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Match } from "./match";
import { Player } from "./player";
import { Team } from "./team";
import { MatchEventType } from "./match-event-type";

export type PlayerMatchEventLog = Omit<
  z.infer<typeof PlayerMatchEventLogPopulatedSchema>,
  "match" | "team" | "match_event_type" | "player"
> & {
  match: Match;
  team: Team;
  match_event_type: MatchEventType;
  player: Player;
};

export type PlayerMatchEventLogForm = Partial<
  Omit<
    z.infer<typeof PlayerMatchEventLogFormSchema>,
    "match" | "team" | "match_event_type" | "player"
  > & {
    match: Match["_id"];
    team: Team["_id"];
    match_event_type: MatchEventType["_id"];
    player: Player["_id"];
    player_name?: string;
  }
>;

export type PlayerMatchEventLogGet = Omit<
  PlayerMatchEventLog,
  "match" | "team" | "match_event_type" | "player" | "player_name"
> & {
  match: Label;
  team: Label;
  match_event_type: Label;
  player: Label;
};
