import { Form as MatchForm, Scraped as MatchScraped } from "../models/match";
import {
  Form as PlayerAppearanceForm,
  Scraped as PlayerAppearanceScraped,
} from "../models/player-appearance";
import {
  Form as PlayerMatchEventLogForm,
  Scraped as PlayerMatchEventLogScraped,
} from "../models/player-match-event-log";
import {
  Form as RefereeAppearanceForm,
  Scraped as RefereeAppearanceScraped,
} from "../models/referee-appearance";
import {
  Form as StaffAppearanceForm,
  Scraped as StaffAppearanceScraped,
} from "../models/staff-appearance";
import {
  Form as TeamMatchFormationForm,
  Scraped as TeamMatchFormationScraped,
} from "../models/team-match-formation";

export type Form = Record<
  string,
  {
    match?: MatchForm;
    playerAppearance?: {
      home: PlayerAppearanceForm[];
      away: PlayerAppearanceForm[];
    };
    playerMatchEventLog?: {
      home: PlayerMatchEventLogForm[];
      away: PlayerMatchEventLogForm[];
    };
    refereeAppearance?: RefereeAppearanceForm[];
    staffAppearance?: {
      home: StaffAppearanceForm[];
      away: StaffAppearanceForm[];
    };
    teamMatchFormation?: {
      home: TeamMatchFormationForm;
      away: TeamMatchFormationForm;
    };
  }
>;

export type Scraped = Record<
  string,
  {
    match?: MatchScraped;
    playerAppearance?: {
      home: PlayerAppearanceScraped[];
      away: PlayerAppearanceScraped[];
    };
    playerMatchEventLog?: {
      home: PlayerMatchEventLogScraped[];
      away: PlayerMatchEventLogScraped[];
    };
    refereeAppearance?: RefereeAppearanceScraped[];
    staffAppearance?: {
      home: StaffAppearanceScraped[];
      away: StaffAppearanceScraped[];
    };
    teamMatchFormation?: {
      home: TeamMatchFormationScraped;
      away: TeamMatchFormationScraped;
    };
  }
>;
