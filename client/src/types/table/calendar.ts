import { ModelType } from "../models";
import { Injury } from "../models/injury";
import { Match } from "../models/match";
import { NationalMatchSeries } from "../models/national-match-series";
import { PlayerRegistration } from "../models/player-registration";
import { StaffRegistration } from "../models/staff-registration";
import { Transfer } from "../models/transfer";

export type CalendarSourceData =
  | {
      modelType: ModelType.MATCH;
      label: string;
      data: Match;
    }
  | {
      modelType: ModelType.PLAYER_REGISTRATION;
      label: string;
      data: PlayerRegistration;
    }
  | {
      modelType: ModelType.STAFF_REGISTRATION;
      label: string;
      data: StaffRegistration;
    }
  | {
      modelType: ModelType.NATIONAL_MATCH_SERIES;
      label: string;
      data: NationalMatchSeries;
    }
  | {
      modelType: ModelType.TRANSFER;
      label: string;
      data: Transfer;
    }
  | {
      modelType: ModelType.INJURY;
      label: string;
      data: Injury;
    };
