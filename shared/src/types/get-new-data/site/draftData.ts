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
  Form as StaffMatchEventLogForm,
  Scraped as StaffMatchEventLogScraped,
} from "../models/staff-match-event-log";
import {
  Form as TeamMatchFormationForm,
  Scraped as TeamMatchFormationScraped,
} from "../models/team-match-formation";
import {
  Form as StatsLForm,
  Scraped as StatsLScraped,
} from "../models/stats-l";

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
    staffMatchEventLog?: {
      home: StaffMatchEventLogForm[];
      away: StaffMatchEventLogForm[];
    };
    teamMatchFormation?: {
      home: TeamMatchFormationForm;
      away: TeamMatchFormationForm;
    };
    satsL?: {
      home: StatsLForm;
      away: StatsLForm;
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
    staffMatchEventLog?: {
      unknown: StaffMatchEventLogScraped[];
      home: StaffMatchEventLogScraped[];
      away: StaffMatchEventLogScraped[];
    };
    teamMatchFormation?: {
      home: TeamMatchFormationScraped;
      away: TeamMatchFormationScraped;
    };
    statsL?: {
      home: StatsLScraped;
      away: StatsLScraped;
    };
  }
>;
