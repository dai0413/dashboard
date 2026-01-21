import { ReactNode } from "react";

import { CountryProvider, useCountry } from "./country";
import { TeamProvider, useTeam } from "./team";
import { PlayerProvider, usePlayer } from "./player";
import { InjuryProvider, useInjury } from "./injury";
import { TransferProvider, useTransfer } from "./transfer";
import {
  NationalMatchSeriesProvider,
  useNationalMatchSeries,
} from "./national-match-series";
import { NationalCallupProvider, useNationalCallup } from "./national-callup";
import { RefereeProvider, useReferee } from "./referee";
import { CompetitionProvider, useCompetition } from "./competition";
import { SeasonProvider, useSeason } from "./season";
import {
  TeamCompetitionSeasonProvider,
  useTeamCompetitionSeason,
} from "./team-competition-season";
import { StadiumProvider, useStadium } from "./stadium";
import {
  CompetitionStageProvider,
  useCompetitionStage,
} from "./competition-stage";
import { MatchFormatProvider, useMatchFormat } from "./match-format";
import { MatchProvider, useMatch } from "./match";
import {
  PlayerRegistrationProvider,
  usePlayerRegistration,
} from "./player-registration";
import {
  PlayerRegistrationHistoryProvider,
  usePlayerRegistrationHistory,
} from "./player-registration-history";
import { MatchEventTypeProvider, useMatchEventType } from "./match-event-type";
import { FormationProvider, useFormation } from "./formation";
import { StaffProvider, useStaff } from "./staff";
import { ModelType } from "../../types/models";
import { MetaCrudContext } from "../../types/context";
import {
  PlayerAppearanceProvider,
  usePlayerAppearance,
} from "./player-appearance";
import {
  StaffAppearanceProvider,
  useStaffAppearance,
} from "./staff-appearance";
import {
  PlayerMatchEventLogProvider,
  usePlayerMatchEventLog,
} from "./player-match-event-log";
import {
  StaffMatchEventLogProvider,
  useStaffMatchEventLog,
} from "./staff-match-event-log";

const ModelWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MatchEventTypeProvider>
      <MatchFormatProvider>
        <CountryProvider>
          <StadiumProvider>
            <CompetitionProvider>
              <SeasonProvider>
                <CompetitionStageProvider>
                  <NationalMatchSeriesProvider>
                    <TeamProvider>
                      <MatchProvider>
                        <TeamCompetitionSeasonProvider>
                          <PlayerProvider>
                            <StaffProvider>
                              <PlayerMatchEventLogProvider>
                                <StaffMatchEventLogProvider>
                                  <PlayerRegistrationProvider>
                                    <PlayerRegistrationHistoryProvider>
                                      <RefereeProvider>
                                        <NationalCallupProvider>
                                          <InjuryProvider>
                                            <TransferProvider>
                                              <FormationProvider>
                                                <PlayerAppearanceProvider>
                                                  <StaffAppearanceProvider>
                                                    {children}
                                                  </StaffAppearanceProvider>
                                                </PlayerAppearanceProvider>
                                              </FormationProvider>
                                            </TransferProvider>
                                          </InjuryProvider>
                                        </NationalCallupProvider>
                                      </RefereeProvider>
                                    </PlayerRegistrationHistoryProvider>
                                  </PlayerRegistrationProvider>
                                </StaffMatchEventLogProvider>
                              </PlayerMatchEventLogProvider>
                            </StaffProvider>
                          </PlayerProvider>
                        </TeamCompetitionSeasonProvider>
                      </MatchProvider>
                    </TeamProvider>
                  </NationalMatchSeriesProvider>
                </CompetitionStageProvider>
              </SeasonProvider>
            </CompetitionProvider>
          </StadiumProvider>
        </CountryProvider>
      </MatchFormatProvider>
    </MatchEventTypeProvider>
  );
};

const useModelContext = (modelType: ModelType | null) => {
  const competition = useCompetition();
  const competitionStage = useCompetitionStage();
  const country = useCountry();
  const injury = useInjury();
  const formation = useFormation();
  const matchEventType = useMatchEventType();
  const matchFormat = useMatchFormat();
  const match = useMatch();
  const nationalCallup = useNationalCallup();
  const nationalMatchSeries = useNationalMatchSeries();
  const playerMatchEventLog = usePlayerMatchEventLog();
  const playerAppearance = usePlayerAppearance();
  const player = usePlayer();
  const playerRegistrationHistory = usePlayerRegistrationHistory();
  const playerRegistration = usePlayerRegistration();
  const referee = useReferee();
  const season = useSeason();
  const stadium = useStadium();
  const staffAppearance = useStaffAppearance();
  const staff = useStaff();
  const teamCompetitionSeason = useTeamCompetitionSeason();
  const team = useTeam();
  const transfer = useTransfer();
  const staffMatchEventLog = useStaffMatchEventLog();

  const map: Record<ModelType, MetaCrudContext<any>> = {
    [ModelType.COMPETITION]: competition.metacrud,
    [ModelType.COMPETITION_STAGE]: competitionStage.metacrud,
    [ModelType.COUNTRY]: country.metacrud,
    [ModelType.INJURY]: injury.metacrud,
    [ModelType.FORMATION]: formation.metacrud,
    [ModelType.MATCH_EVENT_TYPE]: matchEventType.metacrud,
    [ModelType.MATCH_FORMAT]: matchFormat.metacrud,
    [ModelType.MATCH]: match.metacrud,
    [ModelType.NATIONAL_CALLUP]: nationalCallup.metacrud,
    [ModelType.NATIONAL_MATCH_SERIES]: nationalMatchSeries.metacrud,
    [ModelType.PLAYER_MATCH_EVENT_LOG]: playerMatchEventLog.metacrud,
    [ModelType.PLAYER_APPEARANCE]: playerAppearance.metacrud,
    [ModelType.PLAYER]: player.metacrud,
    [ModelType.PLAYER_REGISTRATION_HISTORY]: playerRegistrationHistory.metacrud,
    [ModelType.PLAYER_REGISTRATION]: playerRegistration.metacrud,
    [ModelType.REFEREE]: referee.metacrud,
    [ModelType.SEASON]: season.metacrud,
    [ModelType.STADIUM]: stadium.metacrud,
    [ModelType.STAFF_APPEARANCE]: staffAppearance.metacrud,
    [ModelType.STAFF_MATCH_EVENT_LOG]: staffMatchEventLog.metacrud,
    [ModelType.STAFF]: staff.metacrud,
    [ModelType.TEAM_COMPETITION_SEASON]: teamCompetitionSeason.metacrud,
    [ModelType.TEAM]: team.metacrud,
    [ModelType.TRANSFER]: transfer.metacrud,
  };

  return modelType ? map[modelType] : null;
};

export { ModelWrapper, useModelContext };
