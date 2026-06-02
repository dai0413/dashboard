import { MatchFormatGet } from "../models/match-format";
import { PlayerAppearanceGet } from "../models/player-appearance";
import { MatchGet } from "../models/match";
import { PlayerMatchEventLogGet } from "../models/player-match-event-log";
import { StaffAppearanceGet } from "../models/staff-appearance";
import { RefereeAppearanceGet } from "../models/referee-appearance";
import { DraftData } from "./draftData";
import { CreateItemResponse } from "@dai0413/myorg-shared";

export type AddPostedDraftData = (args: {
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  metaData: Record<string, any>;
  res: CreateItemResponse<any>;
  formLabel: Record<string, any>;
}) => PostedDraftData;

export type PostedDraftDataValues = {
  matchLabel?: string;
  periods?: MatchFormatGet["period"];
  match?: MatchGet;
  playerAppearance?: {
    home: PlayerAppearanceGet[];
    away: PlayerAppearanceGet[];
  };
  playerMatchEventLog?: {
    home: PlayerMatchEventLogGet[];
    away: PlayerMatchEventLogGet[];
  };
  staffAppearance?: {
    home: StaffAppearanceGet[];
    away: StaffAppearanceGet[];
  };
  refereeAppearance?: RefereeAppearanceGet[];
};

export type PostedDraftData = Record<string, PostedDraftDataValues>;
