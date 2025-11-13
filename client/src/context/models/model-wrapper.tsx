import { ReactNode } from "react";
import { CountryProvider } from "./country";
import { TeamProvider } from "./team";
import { PlayerProvider } from "./player";
import { InjuryProvider } from "./injury";
import { TransferProvider } from "./transfer";
import { NationalMatchSeriesProvider } from "./national-match-series";
import { NationalCallupProvider } from "./national-callup";
import { RefereeProvider } from "./referee";
import { CompetitionProvider } from "./competition";
import { SeasonProvider } from "./season";
import { TeamCompetitionSeasonProvider } from "./team-competition-season";
import { StadiumProvider } from "./stadium";
import { CompetitionStageProvider } from "./competition-stage";
import { MatchFormatProvider } from "./match-format";
import { MatchProvider } from "./match";
import { PlayerRegistrationProvider } from "./player-registration";

const ModelWrapper = ({ children }: { children: ReactNode }) => {
  return (
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
                          <PlayerRegistrationProvider>
                            <RefereeProvider>
                              <NationalCallupProvider>
                                <InjuryProvider>
                                  <TransferProvider>
                                    {children}
                                  </TransferProvider>
                                </InjuryProvider>
                              </NationalCallupProvider>
                            </RefereeProvider>
                          </PlayerRegistrationProvider>
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
  );
};

export { ModelWrapper };
