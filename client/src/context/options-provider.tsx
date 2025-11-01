import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePlayer } from "./models/player";
import { useTeam } from "./models/team";
import { useCountry } from "./models/country";
import { useNationalMatchSeries } from "./models/national-match-series";
import { FormTypeMap, ModelType } from "../types/models";
import { convert, OptionsMap, OptionType } from "../utils/createOption";
import { GetOptions, OptionTable } from "../types/option";
import { useCompetition } from "./models/competition";
import { useSeason } from "./models/season";
import { useCompetitionStage } from "./models/competition-stage";
import { useStadium } from "./models/stadium";
import { useMatchFormat } from "./models/match-format";

type OptionsState = {
  getOptions: GetOptions;
};

const dummyGetOptions: GetOptions = (async (_key: string, table?: boolean) => {
  if (table) {
    return { header: [], data: [] };
  } else {
    return [];
  }
}) as any;

const OptionContext = createContext<OptionsState>({
  getOptions: dummyGetOptions,
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
    metacrud: { items: players },
  } = usePlayer();
  const {
    metacrud: { items: teams },
  } = useTeam();
  const {
    metacrud: { items: countries },
  } = useCountry();
  const {
    metacrud: { items: nationalMatchSeries },
  } = useNationalMatchSeries();
  const {
    metacrud: { items: competitions },
  } = useCompetition();
  const {
    metacrud: { items: seasons },
  } = useSeason();
  const {
    metacrud: { items: competitionStage },
  } = useCompetitionStage();
  const {
    metacrud: { items: matchFormat },
  } = useMatchFormat();
  const {
    metacrud: { items: stadium },
  } = useStadium();

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
      [ModelType.COMPETITION_STAGE]: competitionStage,
      [ModelType.COMPETITION]: competitions,
      [ModelType.SEASON]: seasons,
      [ModelType.STADIUM]: stadium,
      [ModelType.MATCH_FORMAT]: matchFormat,
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

  const keyMap: Record<string, keyof OptionsMap> = {
    citizenship: ModelType.COUNTRY,
    from_team: ModelType.TEAM,
    to_team: ModelType.TEAM,
    home_team: ModelType.TEAM,
    away_team: ModelType.TEAM,
    series: ModelType.NATIONAL_MATCH_SERIES,
    parent_stage: ModelType.COMPETITION_STAGE,
    competition_stage: ModelType.COMPETITION_STAGE,
    match_format: ModelType.MATCH_FORMAT,
  };

  function getOptions(key: string, table?: false): OptionArray;
  function getOptions(key: string, table: true): OptionTable;

  function getOptions(
    key: string,
    table?: boolean,
    filter?: boolean
  ): OptionArray | OptionTable {
    function getOptionKey<T extends keyof FormTypeMap>(
      key: keyof FormTypeMap[T] | string,
      keyMap: any
    ): keyof OptionsMap {
      if (typeof key === "string" && key.includes(".")) {
        const parts = key.split(".");
        const last = parts[parts.length - 1];
        return keyMap[last] ?? (last as keyof OptionsMap);
      }
      return keyMap[key as string] ?? (key as keyof OptionsMap);
    }

    const optionKey = getOptionKey(key, keyMap);

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
      value={{
        getOptions,
      }}
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
