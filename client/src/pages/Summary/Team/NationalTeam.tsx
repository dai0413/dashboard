import { SummaryTabItems } from "../../../types/menu/IconButton";
import { useEffect, useState } from "react";
import { api } from "../../../context/api-context";
import { useParams } from "react-router-dom";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { useModal } from "../../../context/modal-context";
import { ModelType } from "../../../types/models";
import { isFilterable, isSortable } from "../../../types/field";
import { MatchGet } from "../../../types/models/match";
import {
  CustomTableContainer,
  TableWithFetch,
} from "../../../components/table";
import { IconButton } from "../../../components/buttons";
import { SelectField } from "../../../components/field";
import { FullScreenLoader } from "../../../components/ui";
import { useTeam } from "../../../context/models/team";
import { fieldDefinition } from "../../../lib/model-fields";
import { APP_ROUTES } from "../../../lib/appRoutes";
import { ColumnType } from "../../../types/table";
import { PlayerGet } from "../../../types/models/player";
import { readItemsBase } from "../../../lib/api";
import { NationalCallup } from "../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../types/models/national-match-series";
import Matrix from "../../../components/table/Matrix";
import { normalizeFiltersForApi } from "../../../utils/filter/normalizeFiltersForApi";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../types/models/player-appearance";
import { convert } from "../../../lib/convert/DBtoGetted";
import { createTabsOptionArray } from "../../../utils/tab/createTabsOptionArray";

const TeamTabItems: SummaryTabItems[] = [
  {
    icon: "series",
    key: "series",
    text: "シリーズ",
  },
  {
    icon: "match",
    key: "match",
    text: "試合",
  },
  {
    icon: "player",
    key: "player",
    text: "選手",
  },
  {
    icon: "line-plot",
    key: "line-plot",
    text: "選手推移",
  },
];

const Tabs = createTabsOptionArray(TeamTabItems);

const NationalTeam = () => {
  const { id } = useParams();
  const {
    detail: { open },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("line-plot");
  // const [selectedTab, setSelectedTab] = useState("series");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useTeam();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  const [players, setPlayers] = useState<PlayerGet[]>([]);
  const [playerIsLoading, setPlayerIsLoading] = useState<boolean>(true);

  const readPlayers = async (id: string) => {
    const nationalCallups = await readItemsBase<NationalCallup[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
      params: {
        getAll: true,
        "series.team": id,
        sort: "-joined_at",
      },
    });

    const nationalMatchSeries = await readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: {
        getAll: true,
        team: id,
        sort: "-joined_at",
      },
    });

    if (!nationalMatchSeries?.data || nationalMatchSeries?.data.length === 0)
      return;
    if (!nationalCallups?.data || nationalCallups?.data.length === 0) return;

    const uniqueDatas = nationalCallups.data
      .filter(
        (nationalCallup, index, self) =>
          self.findIndex((u) => u.player._id === nationalCallup.player._id) ===
          index,
      )
      .sort((a, b) => {
        if (!a.player.dob && !b.player.dob) return 0;
        if (!a.player.dob) return 1; // 生年月日がないものを後ろに
        if (!b.player.dob) return -1;

        return (
          new Date(a.player.dob).getTime() - new Date(b.player.dob).getTime()
        );
      });

    const players = uniqueDatas.map((data) => data.player);

    return setPlayers(players);
  };

  useEffect(() => {
    if (!id) return;
    setPlayerIsLoading(true);
    (async () => {
      await readPlayers(id);
    })();

    setPlayerIsLoading(false);
  }, [id]);

  const testParams = {
    joined_at: ">2025/9/1",
    left_at: "<2026/7/30",
  };

  const [nationalCallUp, setNationalCallUp] = useState<NationalCallup[]>([]);
  const [nationalMatchSeries, setNationalMatchSeries] = useState<
    NationalMatchSeries[]
  >([]);
  const [playerAppearance, setPlayerAppearance] = useState<
    PlayerAppearanceGet[]
  >([]);
  const [callupPlotIsLoding, setCallupPlotIsLoding] = useState<boolean>(false);

  const fetchData = async (
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
  ) => {
    setCallupPlotIsLoding(true);
    if (!id) return setCallupPlotIsLoding(false);
    const readParams: Record<string, any> = {
      getAll: true,
      team: id,
      ...testParams,
    };

    if (filterConditions && filterConditions.length > 0) {
      readParams.filters = JSON.stringify(
        normalizeFiltersForApi(filterConditions),
      );
    }

    if (sortConditions && sortConditions.length > 0) {
      readParams.sorts = JSON.stringify(sortConditions);
    }

    const obj = await readItemsBase<NationalMatchSeries[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
      params: readParams,
    });

    if (obj?.data) setNationalMatchSeries(obj.data);

    const seriesIds = obj?.data.map((d) => d._id);

    if (!seriesIds) return setCallupPlotIsLoding(false);

    const nationalCallupRes = await readItemsBase<NationalCallup[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
      params: { getAll: true, series: seriesIds },
    });

    if (nationalCallupRes?.data) setNationalCallUp(nationalCallupRes.data);

    const matchIds = [
      ...new Set(obj?.data.flatMap((d) => d.matches.map((m) => m._id)) ?? []),
    ];

    if (!matchIds) return setCallupPlotIsLoding(false);

    const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: { getAll: true, match: matchIds, team: id },
    });

    if (playerAppearanceRes?.data) {
      const newPlayerAppearance = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearanceRes.data,
      );
      setPlayerAppearance(newPlayerAppearance);
    }

    setCallupPlotIsLoding(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
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
            <div className="text-gray-600">{`${selected.enTeam}`}</div>
            <div className="text-gray-600">{`略称：${selected.abbr}`}</div>
            <div className="text-sm text-gray-500">
              {`国：${selected.country.label}`}
            </div>
            <div className="text-sm text-gray-500">
              {`ジャンル：${selected.genre}`}
            </div>
            <div className="text-sm text-gray-500">
              {`年代：${selected.age_group}`}
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
            {TeamTabItems.map(({ icon, text }) => {
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
                    `}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* コンテンツ表示 */}
      {selectedTab === "match" && id && (
        <TableWithFetch
          key={`${selectedTab}`}
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
                const againstPkGoal = isHome ? d.away_pk_goal : d.home_pk_goal;

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
      )}

      {selectedTab === "player" && id && (
        <CustomTableContainer
          modelType={ModelType.PLAYER}
          itemsLoading={playerIsLoading}
          fieldDefinitions={[
            {
              label: "選手",
              field: "name",
              isPrimary: true,
              getValueType: ColumnType.FIELD,
              key: "name",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "生年月日",
              field: "dob",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "dob",
              displayOnTable: true,
              type: "Date",
            },
          ]}
          pageNum={1}
          items={players}
          filterField={fieldDefinition[ModelType.PLAYER]?.filter(isFilterable)}
          sortField={fieldDefinition[ModelType.PLAYER]?.filter(isSortable)}
          linkField={[
            {
              field: "name",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
        />
      )}

      {selectedTab === "series" && id && (
        <TableWithFetch
          modelType={ModelType.NATIONAL_MATCH_SERIES}
          fieldDefinitions={[
            {
              label: "名称",
              field: "name",
              width: "250px",
              getValueType: ColumnType.FIELD,
              key: "name",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "招集日",
              field: "joined_at",
              getValueType: ColumnType.FIELD,
              key: "joined_at",
              displayOnTable: true,
              type: "Date",
            },
            {
              label: "解散日",
              field: "left_at",
              getValueType: ColumnType.FIELD,
              key: "left_at",
              displayOnTable: true,
              type: "Date",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
            params: { getAll: true, team: id, sort: "-joined_at" },
          }}
          filterField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
            ?.filter(isFilterable)
            .filter((file) => file.key !== "team")}
          sortField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
            ?.filter(isSortable)
            .filter((file) => file.key !== "team")}
          linkField={[
            {
              field: "name",
              to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              team: id,
            },
          }}
        />
      )}

      {selectedTab === "line-plot" && id && (
        <CustomTableContainer
          itemsLoading={callupPlotIsLoding}
          fieldDefinitions={[]}
          pageNum={1}
          items={nationalCallUp}
          noToolBar={false}
          filterField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]?.filter(
            isFilterable,
          )}
          sortField={fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]?.filter(
            isSortable,
          )}
          reloadFun={async (filterConditions, sortConditions) =>
            fetchData(filterConditions, sortConditions)
          }
          renderView={() => (
            <Matrix
              nationalCallUp={nationalCallUp}
              nationalMatchSeries={nationalMatchSeries}
              playerAppearance={playerAppearance}
            />
          )}
        />
      )}
    </div>
  );
};

export default NationalTeam;
