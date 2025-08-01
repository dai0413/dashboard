import { createContext, useContext, useState } from "react";
import { usePlayer } from "./models/player-context";
import { useTeam } from "./models/team-context";
import { TableHeader } from "../types/types";

export const AreaOptions = [
  "アジア",
  "ヨーロッパ",
  "アフリカ",
  "オセアニア",
  "北アメリカ",
  "南極",
  "南アメリカ",
  "ミクロネシア",
];

export const DistrictOptions = [
  "中央アジア",
  "北ヨーロッパ",
  "南ヨーロッパ",
  "北アフリカ",
  "ポリネシア",
  "南部アフリカ",
  "カリブ海",
  "南極大陸",
  "南アメリカ大陸",
  "西アジア",
  "オーストラリア大陸",
  "中央ヨーロッパ",
  "中東",
  "南アジア",
  "東ヨーロッパ",
  "西ヨーロッパ",
  "中央アメリカ",
  "西アフリカ",
  "北大西洋",
  "東南アジア",
  "東アフリカ",
  "中央アフリカ",
  "北アメリカ大陸",
  "中部アフリカ",
  "東アジア",
  "東部アフリカ",
  "南大西洋",
  "メラネシア",
  "インド洋および南極大陸",
  "ミクロネシア",
  "インド洋",
  "東南アフリカ",
  "オセアニア大陸",
  "大西洋",
  "北部アフリカ",
];

export const ConfederationOptions = [
  "AFC",
  "UEFA",
  "CAF",
  "OFC",
  "CONCACAF",
  "CONMEBOL",
  "FSMFA",
];

export const SubConfederationOptions = [
  "CAFA",
  "UNAF",
  "COSAFA",
  "CFU",
  "AFF",
  "WAFF",
  "SAFF",
  "UNCAF",
  "WAFU",
  "CECAFA",
  "UNIFFAC",
  "NAFU",
  "EAFF",
];

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
  "LCM",
  "RCM",
  "DM",
  "OM",
  "SH",
  "WG",
  "RIH",
  "LIH",
  "RSH",
  "LSH",
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
  "内定解除",
];

export const GenreOptions = [
  "academy",
  "club",
  "college",
  "high_school",
  "second_team",
  "third_team",
  "youth",
];

export const operatorOptions: OptionArray = [
  { key: "equals", label: "と等しい" },
  { key: "not-equal", label: "と等しくない" },
  { key: "contains", label: "を含む" },
  { key: "gte", label: "以上" },
  { key: "lte", label: "以下" },
  { key: "greater", label: "より大きい" },
  { key: "less", label: "より小さい" },
  { key: "is-empty", label: "値なし" },
  { key: "is-not-empty", label: "値あり" },
];

export type OptionArray = Array<
  { key: string; label: string } & Record<string, any>
>;
type OptionTable = {
  header: TableHeader[];
  data: OptionArray;
};

interface GetOptions {
  (key: string, table: true): OptionTable;
  (key: string, table?: false): OptionArray;
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

  const { items: players } = usePlayer();
  const { items: teams } = useTeam();

  const playerOptions = players.map((p) => ({
    label: p.name || p.en_name || "不明",
    key: p._id,
    dob: p.dob,
  }));

  const teamOptions = teams.map((t) => ({
    label: t.abbr || t.team,
    key: t._id,
  }));

  const formOptions = FormOptions.map((f) => ({ label: f, key: f }));
  const positionOptions = PositionOptions.map((p) => ({ label: p, key: p }));
  const genreOptions = GenreOptions.map((p) => ({ label: p, key: p }));
  const areaOptions = AreaOptions.map((p) => ({ label: p, key: p }));
  const districtOptions = DistrictOptions.map((p) => ({ label: p, key: p }));
  const confederationOptions = ConfederationOptions.map((p) => ({
    label: p,
    key: p,
  }));
  const subConfederationOptions = SubConfederationOptions.map((p) => ({
    label: p,
    key: p,
  }));

  function getOptions(key: string, table?: false): OptionArray;
  function getOptions(key: string, table: true): OptionTable;

  function getOptions(key: string, table?: boolean): OptionArray | OptionTable {
    let options: OptionTable;

    if (table === true) {
      switch (key) {
        case "player":
          options = {
            header: [
              { label: "名前", field: "label" },
              { label: "生年月日", field: "dob" },
            ],
            data: playerOptions,
          };
          break;
        case "from_team":
        case "to_team":
        case "team":
          options = {
            header: [{ label: "チーム", field: "label" }],
            data: teamOptions,
          };
          break;
        default:
          options = {
            header: [],
            data: [],
          };
          break;
      }

      const filterValue = filters[key]?.value?.toLowerCase() ?? "";

      options.data = options.data.filter((opt) =>
        opt.label.toLowerCase().replace(/\s+/g, "").includes(filterValue)
      );

      return options;
    } else {
      let options: OptionArray;

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
        case "genre":
          options = genreOptions;
          break;
        case "operator":
          options = operatorOptions;
          break;
        case "area":
          options = areaOptions;
          break;
        case "district":
          options = districtOptions;
          break;
        case "confederation":
          options = confederationOptions;
          break;
        case "sub_confederation":
          options = subConfederationOptions;
          break;
        default:
          return [];
      }

      const filterValue = filters[key]?.value?.toLowerCase() ?? "";
      return options.filter((opt) =>
        opt.label.toLowerCase().replace(/\s+/g, "").includes(filterValue)
      );
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

const OptionsWrapper = ({ children }: { children: React.ReactNode }) => {
  return <OptionProvider>{children}</OptionProvider>;
};

const useOptions = () => {
  const context = useContext(OptionContext);
  if (!context) {
    throw new Error("useOptions must be used within a PlayerProvider");
  }
  return context;
};

export { useOptions, OptionsWrapper };
