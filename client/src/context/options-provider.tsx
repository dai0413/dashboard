import { createContext, useContext } from "react";
import { PlayerProvider, usePlayer } from "./player-context";
import { TeamProvider, useTeam } from "./team-context";
import { FormOptions, PositionOptions } from "../types/models";

type OptionsState = {
  getOptions: (key: string) => { key: string; label: string }[];
};

const OptionContext = createContext<OptionsState>({
  getOptions: () => [],
});

type Props = { children: React.ReactNode };

const OptionProvider = ({ children }: Props) => {
  const { players } = usePlayer();
  const { teams } = useTeam();

  const playerOptions = players.map((p) => ({
    label: p.name || p.en_name || "不明",
    key: p._id,
  }));

  const teamOptions = teams.map((t) => ({
    label: t.abbr,
    key: t._id,
  }));

  const formOptions = FormOptions.map((f) => ({ label: f, key: f }));
  const positionOptions = PositionOptions.map((p) => ({ label: p, key: p }));

  const getOptions = (key: string) => {
    switch (key) {
      case "player":
        return playerOptions;
      case "from_team":
      case "to_team":
        return teamOptions;
      case "form":
        return formOptions;
      case "position":
        return positionOptions;
      default:
        return [];
    }
  };

  return (
    <OptionContext.Provider
      value={{
        getOptions,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
};

const OptionsWrapper = ({ children }: Props) => {
  return (
    <PlayerProvider>
      <TeamProvider>
        <OptionProvider>{children}</OptionProvider>
      </TeamProvider>
    </PlayerProvider>
  );
};

const useOptions = () => {
  const context = useContext(OptionContext);
  if (!context) {
    throw new Error("useOptions must be used within a PlayerProvider");
  }
  return context;
};

export { useOptions, OptionsWrapper };
