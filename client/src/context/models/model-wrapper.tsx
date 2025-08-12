import { ReactNode } from "react";
import { CountryProvider } from "./country-context";
import { TeamProvider } from "./team-context";
import { PlayerProvider } from "./player-context";
import { InjuryProvider } from "./injury-context";
import { TransferProvider } from "./transfer-context";
import { NationalMatchSeriesProvider } from "./national-match-series-context";
import { NationalCallupProvider } from "./national-callup";

const ModelWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <CountryProvider>
      <NationalMatchSeriesProvider>
        <TeamProvider>
          <PlayerProvider>
            <NationalCallupProvider>
              <InjuryProvider>
                <TransferProvider>{children}</TransferProvider>
              </InjuryProvider>
            </NationalCallupProvider>
          </PlayerProvider>
        </TeamProvider>
      </NationalMatchSeriesProvider>
    </CountryProvider>
  );
};

export { ModelWrapper };
