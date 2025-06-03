import { createContext, useContext, useState } from "react";
import { PlayerProvider, usePlayer } from "./player-context";
import { TeamProvider, useTeam } from "./team-context";

export const PositionOptions = [
  "GK",
  "DF",
  "CB",
  "RCB",
  "LCB",
  "SB",
  "RSB",
  "LSB",
  "WB",
  "RWB",
  "LWB",
  "MF",
  "CM",
  "DM",
  "OM",
  "WG",
  "RWG",
  "LWG",
  "CF",
  "FW",
];

export const FormOptions = [
  "完全",
  "期限付き",
  "期限付き延長",
  "期限付き満了",
  "期限付き解除",
  "育成型期限付き",
  "育成型期限付き延長",
  "育成型期限付き満了",
  "育成型期限付き解除",
  "満了",
  "退団",
  "引退",
  "契約解除",
  "復帰",
  "離脱",
  "更新",
];

type OptionsState = {
  getOptions: (key: string) => { key: string; label: string }[];
  updateFilter: (key: string, value: string) => void;
  filters: { [key: string]: { value: string } };
};

const OptionContext = createContext<OptionsState>({
  getOptions: () => [],
  updateFilter: () => {},
  filters: {},
});

type Props = { children: React.ReactNode };

const OptionProvider = ({ children }: Props) => {
  const [filters, setFilters] = useState<{ [key: string]: { value: string } }>(
    {}
  );

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: { value },
    }));
  };

  const { items: players } = usePlayer();
  const { teams } = useTeam();

  const playerOptions = players.map((p) => ({
    label: p.name || p.en_name || "不明",
    key: p._id,
  }));

  const teamOptions = teams.map((t) => ({
    label: t.abbr || t.team,
    key: t._id,
  }));

  const formOptions = FormOptions.map((f) => ({ label: f, key: f }));
  const positionOptions = PositionOptions.map((p) => ({ label: p, key: p }));

  const getOptions = (key: string) => {
    let options: { key: string; label: string }[] = [];

    switch (key) {
      case "player":
        options = playerOptions;
        break;
      case "from_team":
      case "to_team":
      case "team":
        options = teamOptions;
        break;
      case "form":
        options = formOptions;
        break;
      case "position":
        options = positionOptions;
        break;
      default:
        return [];
    }

    const filterValue = filters[key]?.value?.toLowerCase() ?? "";
    return options.filter((opt) =>
      opt.label.toLowerCase().replace(/\s+/g, "").includes(filterValue)
    );
  };

  return (
    <OptionContext.Provider value={{ getOptions, updateFilter, filters }}>
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
