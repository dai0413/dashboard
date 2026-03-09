import { Form as MatchForm, Scraped as MatchScraped } from "./match";
import {
  Form as PlayerAppearanceForm,
  Scraped as PlayerAppearanceScraped,
} from "./player-appearance";
import {
  Form as PlayerMatchEventLogForm,
  Scraped as PlayerMatchEventLogScraped,
} from "./player-match-event-log";
import {
  Form as RefereeAppearanceForm,
  Scraped as RefereeAppearanceScraped,
} from "./referee-appearance";
import {
  Form as StaffAppearanceForm,
  Scraped as StaffAppearanceScraped,
} from "./staff-appearance";

export type Form = {
  match: MatchForm;
  playerAppearance: {
    home: PlayerAppearanceForm[];
    away: PlayerAppearanceForm[];
  };
  playerMatchEventLog: {
    home: PlayerMatchEventLogForm[];
    away: PlayerMatchEventLogForm[];
  };
  refereeAppearance: RefereeAppearanceForm[];
  staffAppearance: {
    home: StaffAppearanceForm[];
    away: StaffAppearanceForm[];
  };
};

export type Scraped = {
  match: MatchScraped;
  playerAppearance: {
    home: PlayerAppearanceScraped[];
    away: PlayerAppearanceScraped[];
  };
  playerMatchEventLog: {
    home: PlayerMatchEventLogScraped[];
    away: PlayerMatchEventLogScraped[];
  };
  refereeAppearance: RefereeAppearanceScraped[];
  staffAppearance: {
    home: StaffAppearanceScraped[];
    away: StaffAppearanceScraped[];
  };
};
