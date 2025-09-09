import { ReactNode } from "react";
import { CountryProvider } from "./country-context";
import { TeamProvider } from "./team-context";
import { PlayerProvider } from "./player-context";
import { InjuryProvider } from "./injury-context";
import { TransferProvider } from "./transfer-context";
import { NationalMatchSeriesProvider } from "./national-match-series-context";
import { NationalCallupProvider } from "./national-callup";
import { RefereeProvider } from "./referee-context";
import { CompetitionProvider } from "./competition-context";
import { SeasonProvider } from "./season-context";
import { TeamCompetitionSeasonProvider } from "./team-competition-season-context";
import { StadiumProvider } from "./stadium-context";

const ModelWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <CountryProvider>
      <StadiumProvider>
        <CompetitionProvider>
          <SeasonProvider>
            <NationalMatchSeriesProvider>
              <TeamProvider>
                <TeamCompetitionSeasonProvider>
                  <PlayerProvider>
                    <RefereeProvider>
                      <NationalCallupProvider>
                        <InjuryProvider>
                          <TransferProvider>{children}</TransferProvider>
                        </InjuryProvider>
                      </NationalCallupProvider>
                    </RefereeProvider>
                  </PlayerProvider>
                </TeamCompetitionSeasonProvider>
              </TeamProvider>
            </NationalMatchSeriesProvider>
          </SeasonProvider>
        </CompetitionProvider>
      </StadiumProvider>
    </CountryProvider>
  );
};

export { ModelWrapper };
