import { ReactNode } from "react";
import { CountryProvider } from "./country-context";
import { TeamProvider } from "./team-context";
import { PlayerProvider } from "./player-context";
import { InjuryProvider } from "./injury-context";
import { TransferProvider } from "./transfer-context";

const ModelWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <CountryProvider>
      <TeamProvider>
        <PlayerProvider>
          <InjuryProvider>
            <TransferProvider>{children}</TransferProvider>
          </InjuryProvider>
        </PlayerProvider>
      </TeamProvider>
    </CountryProvider>
  );
};

export { ModelWrapper };
