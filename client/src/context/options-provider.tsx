import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePlayer } from "./models/player-context";
import { useTeam } from "./models/team-context";
import { useCountry } from "./models/country-context";
import { useNationalMatchSeries } from "./models/national-match-series-context";
import { ModelType } from "../types/models";
import { convert, OptionsMap, OptionType } from "../utils/createOption";
import { OptionArray, OptionTable } from "../types/option";
import { useCompetition } from "./models/competition-context";
import { useSeason } from "./models/season-context";

interface GetOptions {
  (key: string, table: true, filter?: boolean): OptionTable;
  (key: string, table?: false, filter?: boolean): OptionArray;
}

type OptionsState = {
  getOptions: GetOptions;
  updateFilter: (key: string, value: string) => void;
  filters: { [key: string]: { value: string } };
  resetFilter: () => void;
};

const dummyGetOptions = ((_key: string, table?: boolean) => {
  if (table) {
    return { header: [], data: [] };
  } else {
    return [];
  }
}) as GetOptions;

const OptionContext = createContext<OptionsState>({
  getOptions: dummyGetOptions,
  updateFilter: () => {},
  filters: {},
  resetFilter: () => {},
});

const OptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<{ [key: string]: { value: string } }>(
    {}
  );

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: { value },
    }));
  };

  const resetFilter = () => setFilters({});

  const {
    metacrud: { readItems: readPlayers, items: players },
  } = usePlayer();
  const {
    metacrud: { readItems: readTeams, items: teams },
  } = useTeam();
  const {
    metacrud: { readItems: readCountries, items: countries },
  } = useCountry();
  const {
    metacrud: {
      readItems: readNationalMatchSeries,
      items: nationalMatchSeries,
    },
  } = useNationalMatchSeries();
  const {
    metacrud: { readItems: readCompetitions, items: competitions },
  } = useCompetition();
  const {
    metacrud: { readItems: readSeasons, items: seasons },
  } = useSeason();

  useEffect(() => {
    readPlayers({});
    readTeams({});
    readCountries({});
    readNationalMatchSeries({});
    readCompetitions({});
    readSeasons({});
  }, []);

  type Option = {
    label: string;
    key: string;
    [key: string]: any; // 拡張用（dobなど）
  };
  type OptionArray = Option[];

  const dataMap: Partial<OptionsMap> = useMemo(
    () => ({
      [ModelType.PLAYER]: players,
      [ModelType.TEAM]: teams,
      [ModelType.COUNTRY]: countries,
      [ModelType.NATIONAL_MATCH_SERIES]: nationalMatchSeries,
      [ModelType.COMPETITION]: competitions,
      [ModelType.SEASON]: seasons,
      [OptionType.FORM]: [],
      [OptionType.POSITION]: [],
      [OptionType.AREA]: [],
      [OptionType.DISTRICT]: [],
      [OptionType.CONFEDERATION]: [],
      [OptionType.SUB_CONFEDERATION]: [],
      [OptionType.AGE_GROUP]: [],
      [OptionType.LEFT_REASON]: [],
      [OptionType.POSITION_GROUP]: [],
      [OptionType.STATUS]: [],
      [OptionType.GENRE]: [],
      [OptionType.OPERATOR]: [],
    }),
    [players, teams, countries, nationalMatchSeries]
  );

  // key から対応する data を取得する関数
  function getDataForType<T extends keyof OptionsMap>(type: T): OptionsMap[T] {
    const data = dataMap[type];
    if (!data) {
      // 空配列で型を満たす
      return [] as OptionsMap[T];
    }
    return data;
  }

  function getOptions(key: string, table?: false): OptionArray;
  function getOptions(key: string, table: true): OptionTable;

  function getOptions(
    key: string,
    table?: boolean,
    filter?: boolean
  ): OptionArray | OptionTable {
    const keyMap: Record<string, keyof OptionsMap> = {
      citizenship: "country" as keyof OptionsMap,
      from_team: "team" as keyof OptionsMap,
      to_team: "team" as keyof OptionsMap,
      series: "national-match-series" as keyof OptionsMap,
    };

    const optionKey: keyof OptionsMap =
      keyMap[key] ?? (key as keyof OptionsMap);

    const data = getDataForType(optionKey);

    if (table === true) {
      const options = convert(optionKey, data, true);

      if (filter) {
        const filterValue = filters[key]?.value?.toLowerCase() ?? "";
        const OptionTable = options as OptionTable;
        OptionTable.data = OptionTable.data.filter((opt) =>
          opt.label.toLowerCase().replace(/\s+/g, "").includes(filterValue)
        );

        return OptionTable;
      }

      return options;
    } else {
      const options = convert(optionKey, data, false);

      if (filter) {
        const optionsArray = options as OptionArray;
        const filterValue = filters[key]?.value?.toLowerCase() ?? "";
        return optionsArray.filter((opt) =>
          opt.label.toLowerCase().replace(/\s+/g, "").includes(filterValue)
        );
      }

      return options;
    }
  }

  return (
    <OptionContext.Provider
      value={{ getOptions, updateFilter, filters, resetFilter }}
    >
      {children}
    </OptionContext.Provider>
  );
};

const useOptions = () => {
  const context = useContext(OptionContext);
  if (!context) {
    throw new Error("useOptions must be used within a PlayerProvider");
  }
  return context;
};

export { useOptions, OptionProvider };
