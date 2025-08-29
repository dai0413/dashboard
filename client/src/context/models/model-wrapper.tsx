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

const ModelWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <CountryProvider>
      <CompetitionProvider>
        <NationalMatchSeriesProvider>
          <TeamProvider>
            <PlayerProvider>
              <RefereeProvider>
                <NationalCallupProvider>
                  <InjuryProvider>
                    <TransferProvider>{children}</TransferProvider>
                  </InjuryProvider>
                </NationalCallupProvider>
              </RefereeProvider>
            </PlayerProvider>
          </TeamProvider>
        </NationalMatchSeriesProvider>
      </CompetitionProvider>
    </CountryProvider>
  );
};

export { ModelWrapper };
