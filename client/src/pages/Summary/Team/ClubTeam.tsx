import { IconButtonProps } from "../../../components/buttons/IconButton";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS, QueryParams } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { api } from "../../../context/api-context";
import { useModal } from "../../../context/modal-context";
import { ModelType } from "../../../types/models";
import { OptionArray } from "../../../types/form/option";
import { isFilterable, isSortable } from "../../../types/field";
import {
  TeamCompetitionSeason,
  TeamCompetitionSeasonGet,
} from "../../../types/models/team-competition-season";
import { Match, MatchGet } from "../../../types/models/match";
import { Season, SeasonGet } from "../../../types/models/season";
import { PlayerRegistrationGet } from "../../../types/models/player-registration";
import { Data, TeamMatch } from "../../../types/types";
import {
  CustomTableContainer,
  TableWithFetch,
} from "../../../components/table";
import { IconButton } from "../../../components/buttons";
import { SelectField } from "../../../components/field";
import { FullScreenLoader } from "../../../components/ui";
import { useTeam } from "../../../context/models/team";
import { readItemBase, readItemsBase } from "../../../lib/api";
import { fieldDefinition } from "../../../lib/model-fields";
import { convert } from "../../../lib/convert/DBtoGetted";
import { APP_ROUTES } from "../../../lib/appRoutes";
import { convertMatchToTeamMatch } from "../../../utils/data";
import PointLine from "../../../components/plot/PointLine";
import { ColumnType } from "../../../types/table";
import { RadarChart } from "../../../components/plot/RadarChart/RadarChart";
import {
  RadarData,
  RadarDataset,
  RadarField,
} from "../../../components/plot/RadarChart/types";
import { radarFields } from "../../../components/plot/RadarChart/radarFields";
import { TeamGet } from "../../../types/models/team";
import { StatsL, StatsLGet } from "../../../types/models/stats-l";
import { buildRadarPlotData } from "../../../utils/plot";

type DateUnit = "day" | "month" | "year";

type SeasonDates = {
  startDate: string | undefined;
  endDate: string | undefined;
  seasonRange: string[];
};

const guideLine = (
  value: number,
  dataCount: number,
  options?: {
    dash?: number[];
    color?: string;
    width?: number;
  },
): RadarDataset => ({
  label: `${value}`,
  data: Array(dataCount).fill(value),
  borderColor: options?.color ?? "#9ca3af",
  backgroundColor: "transparent",
  borderWidth: options?.width ?? 1,
  borderDash: options?.dash ?? [4, 4],
  pointRadius: 0,
  pointHoverRadius: 0,
  pointHitRadius: 0,
  guide: true,
});

const addDate = (date: Date, amount: number, unit: DateUnit): Date => {
  const d = new Date(date);

  switch (unit) {
    case "day":
      d.setDate(d.getDate() + amount);
      break;

    case "month":
      d.setMonth(d.getMonth() + amount);
      break;

    case "year":
      d.setFullYear(d.getFullYear() + amount);
      break;
  }

  return d;
};

const getSeasonDates = (
  season: SeasonGet | null,
): {
  normalSeason: SeasonDates;
  transferWindow: SeasonDates;
  future: SeasonDates;
} => {
  if (!season) {
    const empty = {
      startDate: undefined,
      endDate: undefined,
      oneYearLater: undefined,
      seasonRange: [],
    };
    return {
      normalSeason: empty,
      transferWindow: empty,
      future: empty,
    };
  }

  const seasonStart = season.start_date
    ? new Date(season.start_date)
    : undefined;

  const seasonEnd = season.end_date ? new Date(season.end_date) : undefined;

  /** normalSeason */
  const normalSeason: SeasonDates = {
    startDate: toDateKey(seasonStart),
    endDate: toDateKey(seasonEnd),
    seasonRange: [
      seasonStart && `>=${toDateKey(seasonStart)}`,
      seasonEnd && `<=${toDateKey(seasonEnd)}`,
    ].filter(Boolean) as string[],
  };

  /** transferWindow */
  const transferWindowStart = seasonStart;
  const transferWindow: SeasonDates = {
    startDate: toDateKey(transferWindowStart),
    endDate: toDateKey(seasonEnd),
    seasonRange: [
      transferWindowStart && `>=${toDateKey(transferWindowStart)}`,
      seasonEnd && `<=${toDateKey(seasonEnd)}`,
    ].filter(Boolean) as string[],
  };

  /** future（end +1日） */
  const futureStart = seasonEnd ? addDate(seasonEnd, 1, "day") : undefined;
  const futureEnd = seasonEnd ? addDate(seasonEnd, 1, "year") : undefined;

  const future: SeasonDates = {
    startDate: toDateKey(futureStart),
    endDate: toDateKey(futureEnd),
    seasonRange: [
      futureStart && `>=${toDateKey(futureStart)}`,
      futureEnd && `<=${toDateKey(futureEnd)}`,
    ].filter(Boolean) as string[],
  };

  return { normalSeason, transferWindow, future };
};

const TeamTabItems: IconButtonProps[] = [
  {
    icon: "player",
    text: "選手",
  },
  {
    icon: "future_in",
    text: "内定",
  },
  {
    icon: "transfer_in",
    text: "加入",
  },
  {
    icon: "transfer_out",
    text: "退団",
  },
  {
    icon: "loan",
    text: "レンタル中",
  },
  {
    icon: "injury",
    text: "怪我",
  },
  {
    icon: "match",
    text: "試合",
  },
  {
    icon: "registration",
    text: "選手登録",
  },
  {
    icon: "series",
    text: "所属カテゴリ",
  },
  {
    icon: "line-plot",
    text: "勝点推移",
  },
  {
    icon: "pie-plot_1",
    text: "攻撃スタッツ",
  },
  {
    icon: "pie-plot_2",
    text: "守備スタッツ",
  },
  {
    icon: "setting",
    text: "スタッツ",
  },
];

const Tabs = TeamTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed"),
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const ClubTeam = () => {
  const { id } = useParams();
  const {
    detail: { open },
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("player");

  const {
    metacrud: { selected, readItem },
  } = useTeam();

  const [teamCompetitionSeason, setTeamCompetitionSeason] = useState<
    Data<TeamCompetitionSeasonGet>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: true,
  });

  const readSeason = async (seasonId: string) => {
    const item = await readItemBase<Season>({
      apiInstance: api,
      backendRoute: API_PATHS.SEASON.DETAIL(seasonId),
    });

    if (!item) return;

    const nextSeasonDates = getSeasonDates(convert(ModelType.SEASON, item));

    setSeasonDates(nextSeasonDates);
  };

  const readTeamCompetitionSeason = async (params: QueryParams) => {
    const obj = await readItemsBase<TeamCompetitionSeason[]>({
      apiInstance: api,
      backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
      params,
      handleLoading: (time) =>
        setTeamCompetitionSeason((prev) => ({
          ...prev,
          isLoading: time === "start",
        })),
    });

    if (obj?.data && obj.data.length > 0) {
      const seasons: TeamCompetitionSeason[] = obj?.data;

      const nextTeamCompetitionSeason = convert(
        ModelType.TEAM_COMPETITION_SEASON,
        seasons,
      );

      const todaySeason = seasons.find(
        (s: TeamCompetitionSeason) =>
          s.season.start_date &&
          new Date(s.season.start_date) <= new Date() &&
          s.season.end_date &&
          new Date(s.season.end_date) >= new Date(),
      );

      const currentSeason = seasons.find(
        (s: TeamCompetitionSeason) => s.season.current,
      );

      const lastSeason = seasons.reduce(
        (latest, current) => {
          if (!current.season?.start_date || !latest?.season?.start_date) {
            return latest ?? current;
          }

          return new Date(current.season.start_date) >
            new Date(latest.season.start_date)
            ? current
            : latest;
        },
        undefined as TeamCompetitionSeason | undefined,
      );

      const nextSelectedTeamCompetitionSeason =
        todaySeason ?? currentSeason ?? lastSeason;

      if (nextSelectedTeamCompetitionSeason) {
        const nextSeasonRange = convert(
          ModelType.SEASON,
          nextSelectedTeamCompetitionSeason.season,
        );
        setSeasonDates(getSeasonDates(nextSeasonRange));

        setTeamCompetitionSeason({
          data: nextTeamCompetitionSeason,
          page: obj.page ? obj.page : 1,
          totalCount: obj.totalCount ? obj.totalCount : 1,
          isLoading: false,
        });

        setSelectedTeamCompetitionSeason(
          convert(
            ModelType.TEAM_COMPETITION_SEASON,
            nextSelectedTeamCompetitionSeason,
          ),
        );
      }
    }
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
      await readTeamCompetitionSeason({
        team: id,
        "competition.category": "league",
        "competition.level": "exists",
        getAll: true,
      });
    })();
  }, [id]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  const [selectedteamCompetitionSeason, setSelectedTeamCompetitionSeason] =
    useState<TeamCompetitionSeasonGet | null>(null);

  const [seasonDates, setSeasonDates] = useState<{
    normalSeason: SeasonDates;
    transferWindow: SeasonDates;
    future: SeasonDates;
  }>({
    normalSeason: {
      startDate: undefined,
      endDate: undefined,
      seasonRange: [],
    },
    transferWindow: {
      startDate: undefined,
      endDate: undefined,
      seasonRange: [],
    },
    future: {
      startDate: undefined,
      endDate: undefined,
      seasonRange: [],
    },
  });

  useEffect(() => {
    const seasonId = selectedteamCompetitionSeason?.season.id;
    if (!seasonId) return;
    (async () => {
      readSeason(seasonId);
    })();
  }, [selectedteamCompetitionSeason?._id, formIsOpen]);

  const handleSetSelectedSeason = (id: string | number | Date | undefined) => {
    const selected =
      teamCompetitionSeason.data.find((s) => s._id === id) ?? null;
    setSelectedTeamCompetitionSeason(selected);
  };

  const seasonOptions: OptionArray = useMemo(
    () =>
      teamCompetitionSeason.data.map((s) => {
        return {
          key: s._id,
          label: s.season.label,
        };
      }),
    [teamCompetitionSeason],
  );

  const [teamMatchs, setTeamMatchs] = useState<TeamMatch[]>([]);
  const [plotData, setPlotData] = useState<{
    label: string[];
    value: number[];
  }>({ label: [], value: [] });

  async function readMatchs(id: string, seasonId: string): Promise<MatchGet[]> {
    const obj = await readItemsBase<Match[]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: { team: id, season: seasonId, getAll: true, sort: "date" },
    });

    if (!obj) return [];

    const matches = convert(ModelType.MATCH, obj.data);

    return matches;
  }

  const readPlotData = async (id: string, seasonId: string) => {
    const matches = await readMatchs(id, seasonId);
    const teamMatchs = convertMatchToTeamMatch(matches, id);

    setTeamMatchs(teamMatchs);

    const labels = teamMatchs.map((match) =>
      match.match_week ? `w-${match.match_week}` : "",
    );

    let total = 0;
    const cumulativePoints = teamMatchs.map((d) => {
      const point = d.result === "勝ち" ? 3 : d.result === "分け" ? 1 : 0;
      total += point;
      return total;
    });

    setPlotData({ label: labels, value: cumulativePoints });
  };

  const [offRadarData, setOffRadarData] = useState<RadarData | null>(null);
  const [defRadarData, setDefRadarData] = useState<RadarData | null>(null);
  const [radarDataIsLoading, setRadarDataIsLoading] = useState<boolean>(false);

  const convertToRadarData = (
    teamId: string,
    datasetLabel: string,
    field: RadarField[],
    baseData: StatsLGet[],
    plotData: StatsLGet[],
  ): RadarData | null => {
    const plot = buildRadarPlotData(
      baseData,
      plotData,
      field,
      (d) => d.team.id || "",
    );

    const teamData = plot.get(teamId);

    if (!teamData) return null;

    const labels = field.map((f) => f.label);
    const fieldCountr = field.length;

    const datasets = [
      {
        label: datasetLabel,
        data: field.map((f) => teamData[f.key].deviation),
        tooltipData: field.map((f) => teamData[f.key]),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
      },
      guideLine(40, fieldCountr),
      guideLine(50, fieldCountr, {
        dash: [],
        width: 2,
        color: "#6b7280",
      }),
      guideLine(60, fieldCountr),
    ];

    return { labels, datasets };
  };

  const readRadarData = async (selected: TeamGet | null, id: string) => {
    setRadarDataIsLoading(true);

    if (
      !selected ||
      !selectedteamCompetitionSeason ||
      !selectedteamCompetitionSeason.season.id
    )
      return setRadarDataIsLoading(false);

    let teamLabel = [
      selected?.team || selected?.abbr || selected?.enTeam || "",
    ];

    // リーグ平均, 標準偏差用データ
    const readBaseData = async (season: string): Promise<StatsLGet[]> => {
      const res = await readItemsBase<StatsL[]>({
        apiInstance: api,
        backendRoute: API_PATHS.STATS_L.ROOT,
        params: {
          getAll: true,
          "match.season": season,
        },
      });

      if (!res?.data) return [];

      const baseDatas = convert(ModelType.STATS_L, res?.data);
      return baseDatas;
    };

    // リーグ平均, 標準偏差用データ
    const readData = async (season: string): Promise<StatsLGet[]> => {
      const res = await readItemsBase<StatsL[]>({
        apiInstance: api,
        backendRoute: API_PATHS.STATS_L.ROOT,
        params: {
          getAll: true,
          "match.season": season,
        },
      });

      if (!res?.data) return [];

      const baseDatas = convert(ModelType.STATS_L, res?.data);
      return baseDatas;
    };

    const baseData = await readBaseData(
      selectedteamCompetitionSeason.season.id,
    );
    const plotData = await readData(selectedteamCompetitionSeason.season.id);

    teamLabel.push(`${plotData.filter((d) => d.team.id === id).length}試合`);

    const datasetLabel = teamLabel.join(" ");
    const offFields = radarFields.filter(
      (f) => !!f.default && f.category === "attack",
    );
    const defFields = radarFields.filter(
      (f) => !!f.default && f.category === "defense",
    );

    const offRadarData = convertToRadarData(
      id,
      datasetLabel,
      offFields,
      baseData,
      plotData,
    );

    const defRadarData = convertToRadarData(
      id,
      datasetLabel,
      defFields,
      baseData,
      plotData,
    );

    if (offRadarData) {
      setOffRadarData(offRadarData);
    }

    if (defRadarData) {
      setDefRadarData(defRadarData);
    }

    setRadarDataIsLoading(false);
  };

  useEffect(() => {
    if (
      !id ||
      !selectedteamCompetitionSeason ||
      !selectedteamCompetitionSeason.season.id
    )
      return;
    readPlotData(id, selectedteamCompetitionSeason.season.id);
    readRadarData(selected, id);
  }, [id, selectedteamCompetitionSeason]);

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!teamCompetitionSeason.isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.TEAM, selected._id);
              }}
            >
              {selected.team}
            </div>
            <div className="w-full md:w-50">
              <SelectField
                type="text"
                value={
                  selectedteamCompetitionSeason
                    ? selectedteamCompetitionSeason?._id
                    : ""
                }
                options={seasonOptions}
                onChange={handleSetSelectedSeason}
                defaultOption={
                  seasonOptions.length > 0 ? undefined : "登録シーズンなし"
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="text-gray-600">{`${selected.enTeam}`}</div>
            <div className="text-gray-600">{`略称：${selected.abbr}`}</div>
            <div className="text-sm text-gray-500">
              {`国：${selected.country.label}`}
            </div>
            <div className="text-sm text-gray-500">
              {`ジャンル：${selected.genre}`}
            </div>
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}

      {/* タブメニュー */}
      <div className="mb-4 pb-2">
        {/* SP: select */}
        <div className="mt-4 block sm:hidden">
          <SelectField
            type="text"
            value={selectedTab}
            options={Tabs}
            onChange={handleSelectedTab}
          />
        </div>

        {/* PC: tabs */}
        <div className="hidden sm:flex gap-4 border-b border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            {TeamTabItems.map(({ icon, text, className }) => {
              const isActive = selectedTab === icon;
              return (
                <li key={text}>
                  <IconButton
                    icon={icon}
                    text={text}
                    color={isActive ? "green" : "gray"}
                    onClick={() => icon && handleSelectedTab(icon)}
                    direction="horizontal"
                    className={`
                        px-4 py-2 border-b-2 
                        ${
                          isActive
                            ? "border-green-500 text-green-700 font-semibold"
                            : "border-transparent hover:border-gray-300"
                        }
                        ${className}
                    `}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* コンテンツ表示 */}
      {selectedTab === "player" && id && seasonDates.transferWindow.endDate && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に所属した選手`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.transferWindow.endDate}`}
            modelType={ModelType.TRANSFER}
            fieldDefinitions={[
              {
                label: "ポジション",
                field: "position",
                width: "70px",
                getValueType: ColumnType.FIELD,
                key: "position",
                displayOnTable: true,
                type: "select",
              },
              {
                label: "選手",
                field: "player",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "加入日",
                field: "from_date",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "from_date",
                displayOnTable: true,
                type: "Date",
              },
              {
                label: "移籍形態",
                field: "form",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "form",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.TRANSFER.ROOT,
              params: {
                getAll: true,
                sort: "position_group_order,number",
                to_team: id,
                from_date: seasonDates.transferWindow.seasonRange,
                form: "完全|期限付き|育成型期限付き|期限付き延長|育成型期限付き延長|復帰|更新",
              },
            }}
            filterField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "to_team")}
            sortField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isSortable)
              .filter((file) => file.key !== "to_team")}
            linkField={[
              {
                field: "player",
                to: APP_ROUTES.PLAYER_SUMMARY,
              },
            ]}
            initialData={{
              formData: { to_team: id },
              metaData: { team: id },
            }}
          />
        </>
      )}

      {selectedTab === "future_in" && id && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.future.startDate}~~~${seasonDates.future.endDate}に日本国内育成年代チームから加入予定の選手`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.TRANSFER}
            fieldDefinitions={[
              {
                label: "加入日",
                field: "from_date",
                getValueType: ColumnType.FIELD,
                key: "from_date",
                displayOnTable: true,
                type: "Date",
              },
              {
                label: "選手",
                field: "player",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "移籍元",
                field: "from_team",
                getValueType: ColumnType.FIELD,
                key: "from_team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "ポジション",
                field: "position",
                getValueType: ColumnType.FIELD,
                key: "position",
                displayOnTable: true,
                type: "select",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.TRANSFER.ROOT,
              params: {
                getAll: true,
                from_date: [
                  `>=${seasonDates.future.startDate}`,
                  `<=${seasonDates.future.endDate}`,
                ].filter((t) => t !== undefined),
                to_team: id,
                "from_team.age_group": "!full",
                from_team: `exists`,
              },
            }}
            filterField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "to_team")}
            sortField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isSortable)
              .filter((file) => file.key !== "to_team")}
            linkField={[
              {
                field: "player",
                to: APP_ROUTES.PLAYER_SUMMARY,
              },
              {
                field: "from_team",
                to: APP_ROUTES.TEAM_SUMMARY,
              },
            ]}
            initialData={{ formData: { to_team: id } }}
          />
        </>
      )}

      {selectedTab === "transfer_in" && id && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に加入した選手`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.TRANSFER}
            fieldDefinitions={[
              {
                label: "加入日",
                field: "from_date",
                getValueType: ColumnType.FIELD,
                key: "from_date",
                displayOnTable: true,
                type: "Date",
              },
              {
                label: "選手",
                field: "player",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "移籍元",
                field: "from_team",
                getValueType: ColumnType.FIELD,
                key: "from_team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "形態",
                field: "form",
                getValueType: ColumnType.FIELD,
                key: "form",
                displayOnTable: true,
                type: "select",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.TRANSFER.ROOT,
              params: {
                getAll: true,
                to_team: id,
                form: "!更新",
                from_date: seasonDates.transferWindow.seasonRange,
              },
            }}
            filterField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "to_team")}
            sortField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isSortable)
              .filter((file) => file.key !== "to_team")}
            linkField={[
              {
                field: "player",
                to: APP_ROUTES.PLAYER_SUMMARY,
              },
              {
                field: "from_team",
                to: APP_ROUTES.TEAM_SUMMARY,
              },
            ]}
            initialData={{ formData: { to_team: id } }}
          />
        </>
      )}

      {selectedTab === "transfer_out" && id && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に退団した選手`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.TRANSFER}
            fieldDefinitions={[
              {
                label: "加入日",
                field: "from_date",
                getValueType: ColumnType.FIELD,
                key: "from_date",
                displayOnTable: true,
                type: "Date",
              },
              {
                label: "選手",
                field: "player",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "移籍先",
                field: "to_team",
                getValueType: ColumnType.FIELD,
                key: "to_team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "形態",
                field: "form",
                getValueType: ColumnType.FIELD,
                key: "form",
                displayOnTable: true,
                type: "select",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.TRANSFER.ROOT,
              params: {
                getAll: true,
                from_team: id,
                from_date: seasonDates.transferWindow.seasonRange,
              },
            }}
            filterField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "from_team")}
            sortField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isSortable)
              .filter((file) => file.key !== "from_team")}
            linkField={[
              {
                field: "player",
                to: APP_ROUTES.PLAYER_SUMMARY,
              },
              {
                field: "to_team",
                to: APP_ROUTES.TEAM_SUMMARY,
              },
            ]}
            initialData={{ formData: { from_team: id } }}
          />
        </>
      )}

      {selectedTab === "loan" && id && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.transferWindow.startDate}~~~${seasonDates.transferWindow.endDate}に期限付き移籍した選手`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.TRANSFER}
            fieldDefinitions={[
              {
                label: "加入日",
                field: "from_date",
                getValueType: ColumnType.FIELD,
                key: "from_date",
                displayOnTable: true,
                type: "Date",
              },
              {
                label: "選手",
                field: "player",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "select",
              },
              {
                label: "移籍先",
                field: "to_team",
                getValueType: ColumnType.FIELD,
                key: "to_team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "形態",
                field: "form",
                getValueType: ColumnType.FIELD,
                key: "form",
                displayOnTable: true,
                type: "select",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.TRANSFER.ROOT,
              params: {
                getAll: true,
                from_team: id,
                form: [
                  "期限付き",
                  "育成型期限付き",
                  "期限付き延長",
                  "育成型期限付き延長",
                ],
                from_date: seasonDates.transferWindow.seasonRange,
              },
            }}
            filterField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "to_team")}
            sortField={fieldDefinition[ModelType.TRANSFER]
              ?.filter(isSortable)
              .filter((file) => file.key !== "to_team")}
            linkField={[
              {
                field: "player",
                to: APP_ROUTES.PLAYER_SUMMARY,
              },
              {
                field: "to_team",
                to: APP_ROUTES.TEAM_SUMMARY,
              },
            ]}
            initialData={{ formData: { from_team: id } }}
          />
        </>
      )}

      {selectedTab === "injury" && id && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に発表された負傷者`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.INJURY}
            fieldDefinitions={[
              {
                label: "発表日",
                field: "doa",
                getValueType: ColumnType.FIELD,
                key: "doa",
                displayOnTable: true,
                type: "Date",
              },
              {
                label: "選手",
                field: "player",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "負傷箇所・診断結果",
                field: "injured_part",
                getValueType: ColumnType.FIELD,
                key: "injured_part",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "全治",
                field: "ttp",
                getValueType: ColumnType.FIELD,
                key: "ttp",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.INJURY.ROOT,
              params: {
                getAll: true,
                team: id,
                doa: seasonDates.normalSeason.seasonRange,
              },
            }}
            filterField={fieldDefinition[ModelType.INJURY]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "player")}
            sortField={fieldDefinition[ModelType.INJURY]
              ?.filter(isSortable)
              .filter((file) => file.key !== "player")}
            linkField={[
              {
                field: "player",
                to: APP_ROUTES.PLAYER_SUMMARY,
              },
            ]}
            initialData={{ formData: { team: id } }}
          />
        </>
      )}

      {selectedTab === "match" && id && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に開催された試合`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.MATCH}
            fieldDefinitions={[
              {
                label: "開催日",
                key: "date",
                getData: (d: MatchGet) => toDateKey(d.date, true) || "",
                getValueType: ColumnType.CUSTOM,
                displayOnTable: true,
                type: "Date",
              },
              {
                label: "大会",
                field: "competition",
                getValueType: ColumnType.FIELD,
                key: "competition",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "ステージ",
                field: "competition_stage",
                getValueType: ColumnType.FIELD,
                key: "competition_stage",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "節",
                field: "match_week",
                width: "80px",
                getValueType: ColumnType.FIELD,
                key: "match_week",
                displayOnTable: true,
                type: "number",
              },
              {
                label: "相手",
                key: "vsTeam",
                displayOnTable: true,
                getData: (d: MatchGet) => {
                  const isHome = d.home_team.id === id;
                  const vsTeam = isHome ? d.away_team : d.home_team;

                  return vsTeam;
                },
                getValueType: ColumnType.CUSTOM,
                type: "string",
              },
              {
                label: "結果",
                key: "result",
                displayOnTable: true,
                getData: (d: MatchGet) => {
                  const isHome = d.home_team.id === id;
                  const goal = isHome ? d.home_goal : d.away_goal;
                  const againstGoal = isHome ? d.away_goal : d.home_goal;
                  const pkGoal = isHome ? d.home_pk_goal : d.away_pk_goal;
                  const againstPkGoal = isHome
                    ? d.away_pk_goal
                    : d.home_pk_goal;

                  const score =
                    goal !== undefined && againstGoal !== undefined
                      ? `${goal}-${againstGoal}`
                      : "";

                  const pk =
                    pkGoal !== undefined && againstPkGoal !== undefined
                      ? `(${pkGoal}PK${againstPkGoal})`
                      : "";

                  return score + pk;
                },
                getValueType: ColumnType.CUSTOM,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.MATCH.ROOT,
              params: {
                getAll: true,
                team: id,
                date: seasonDates.normalSeason.seasonRange,
                sort: "date",
              },
            }}
            filterField={fieldDefinition[ModelType.MATCH]?.filter(isFilterable)}
            sortField={fieldDefinition[ModelType.MATCH]?.filter(isSortable)}
            linkField={[
              { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
              { field: "vsTeam", to: APP_ROUTES.TEAM_SUMMARY },
              { field: "result", to: APP_ROUTES.MATCH_SUMMARY },
            ]}
          />
        </>
      )}

      {selectedTab === "registration" && id && (
        <>
          <div className="text-gray-600">
            {`${seasonDates.normalSeason.startDate}~~~${seasonDates.normalSeason.endDate}に出場登録された選手`}
          </div>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.PLAYER_REGISTRATION}
            fieldDefinitions={[
              {
                label: "シーズン",
                field: "season",
                getValueType: ColumnType.FIELD,
                key: "season",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "背番号",
                key: "number",
                displayOnTable: true,
                getData: (data: PlayerRegistrationGet) => {
                  return data.number ? String(data.number) : "";
                },
                getValueType: ColumnType.CUSTOM,
                type: "number",
              },
              {
                label: "選手",
                field: "player",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "登録中・抹消済",
                field: "registration_status",
                getValueType: ColumnType.FIELD,
                key: "registration_status",
                displayOnTable: true,
                type: "select",
              },
              {
                label: "2種・特別指定",
                key: "special_type",
                displayOnTable: true,
                getData: (data: PlayerRegistrationGet) => {
                  if (data.isSpecialDesignation) return "特別指定";
                  if (data.isTypeTwo) return "2種";
                  return "";
                },
                getValueType: ColumnType.CUSTOM,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
              params: {
                getAll: true,
                team: id,
                date: seasonDates.normalSeason.seasonRange,
                registration_type: "register",
                sort: "number,date",
              },
            }}
            filterField={fieldDefinition[ModelType.PLAYER_REGISTRATION]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "team")}
            sortField={fieldDefinition[ModelType.PLAYER_REGISTRATION]
              ?.filter(isSortable)
              .filter((file) => file.key !== "team")}
            linkField={[
              {
                field: "player",
                to: APP_ROUTES.PLAYER_SUMMARY,
              },
            ]}
          />
        </>
      )}

      {selectedTab === "series" && id && (
        <>
          <TableWithFetch
            key={`${selectedTab}-${seasonDates.normalSeason.startDate}`}
            modelType={ModelType.TEAM_COMPETITION_SEASON}
            fieldDefinitions={[
              {
                label: "シーズン",
                field: "season",
                getValueType: ColumnType.FIELD,
                key: "season",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "大会",
                field: "competition",
                getValueType: ColumnType.FIELD,
                key: "competition",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "メモ",
                field: "note",
                isPrimary: true,
                getValueType: ColumnType.FIELD,
                key: "note",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
              params: {
                getAll: true,
                team: id,
                sort: "season",
              },
            }}
            filterField={fieldDefinition[ModelType.TEAM_COMPETITION_SEASON]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "team")}
            sortField={fieldDefinition[ModelType.TEAM_COMPETITION_SEASON]
              ?.filter(isSortable)
              .filter((file) => file.key !== "team")}
            linkField={[
              {
                field: "competition",
                to: APP_ROUTES.COMPETITION_SUMMARY,
              },
            ]}
          />
        </>
      )}

      {selectedTab === "setting" &&
        id &&
        selectedteamCompetitionSeason?.season.id && (
          <>
            <TableWithFetch
              key={`${selectedTab}-${selectedteamCompetitionSeason?.season.id}`}
              modelType={ModelType.STATS_L}
              fieldDefinitions={fieldDefinition[ModelType.STATS_L] || []}
              fetch={{
                apiRoute: API_PATHS.STATS_L.ROOT,
                params: {
                  getAll: true,
                  team: id,
                  "match.season": selectedteamCompetitionSeason?.season.id,
                  sort: "match.date",
                },
              }}
              filterField={fieldDefinition[ModelType.STATS_L]
                ?.filter(isFilterable)
                .filter((file) => file.key !== "team")}
              sortField={fieldDefinition[ModelType.STATS_L]
                ?.filter(isSortable)
                .filter((file) => file.key !== "team")}
              linkField={[
                {
                  field: "match",
                  to: APP_ROUTES.MATCH_SUMMARY,
                },
              ]}
            />
          </>
        )}

      {selectedTab === "line-plot" && id && (
        <>
          <div className="text-gray-600">
            {`${selectedteamCompetitionSeason?.season.label} ${selectedteamCompetitionSeason?.team.label} の勝点推移`}
          </div>
          <PointLine teamMatchs={teamMatchs} plotData={plotData} />
        </>
      )}

      {selectedTab === "pie-plot_1" && id && (
        <CustomTableContainer
          modelType={ModelType.STATS_L}
          fieldDefinitions={[]}
          pageNum={1}
          items={offRadarData?.datasets || []}
          itemsLoading={radarDataIsLoading}
          reloadFun={async () => readRadarData(selected, id)}
          initialData={{
            formData: {},
            metaData: {},
          }}
          renderView={() => (
            <RadarChart
              labels={offRadarData?.labels || []}
              datasets={offRadarData?.datasets || []}
            />
          )}
        />
      )}

      {selectedTab === "pie-plot_2" && id && (
        <CustomTableContainer
          modelType={ModelType.STATS_L}
          fieldDefinitions={[]}
          pageNum={1}
          items={defRadarData?.datasets || []}
          itemsLoading={radarDataIsLoading}
          reloadFun={async () => readRadarData(selected, id)}
          initialData={{
            formData: {},
            metaData: {},
          }}
          renderView={() => (
            <RadarChart
              labels={defRadarData?.labels || []}
              datasets={defRadarData?.datasets || []}
            />
          )}
        />
      )}
    </div>
  );
};

export default ClubTeam;
