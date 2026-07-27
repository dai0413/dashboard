import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { CustomTableContainer, TableWithFetch } from "../../components/table";
import { GettedModelDataMap, ModelType } from "../../types/models";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/form/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable, UIFieldDefinition } from "../../types/field";
import { readItemsBase } from "../../lib/api";
import { api } from "../../context/api-context";
import { convert } from "../../lib/convert/DBtoGetted";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useCompetition } from "../../context/models/competition";
import { Season, SeasonGet } from "../../types/models/season";
import { MatchGet } from "../../types/models/match";
import { Data } from "../../types/types";
import { PlayerRegistrationGet } from "../../types/models/player-registration";
import { ColumnType } from "../../types/table";
import { StaffRegistrationGet } from "../../types/models/staff-registration";
import { useModal } from "../../context/modal-context";
import { SummaryTabItems } from "../../types/menu/IconButton";
import { StatsL, StatsLGet } from "../../types/models/stats-l";
import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { buildTableData } from "../../utils/plot";
import { radarFields } from "../../components/plot/RadarChart/radarFields";
import SummaryTabMenu from "./components/SummaryTabMenu";
import { convertFieldDefinition } from "../../utils/displayField/convertFieldDefinition";

const tabItems: SummaryTabItems[] = [
  {
    icon: "competitionStage",
    key: "competitionStage",
    text: "ステージ",
  },
  {
    icon: "teamCompetitionSeason",
    key: "teamCompetitionSeason",
    text: "チーム",
  },
  {
    icon: "match",
    key: "match",
    text: "試合",
  },
  {
    icon: "registration",
    key: "registration",
    text: "選手登録",
  },
  {
    icon: "staff",
    key: "staff",
    text: "スタッフ登録",
  },
  {
    icon: "team",
    key: "team",
    text: "シーズン",
  },
  {
    icon: "pie-plot_1",
    key: "pie-plot-actual",
    text: "スタッツ実数値",
  },
  {
    icon: "pie-plot_2",
    key: "pie-plot-deviation",
    text: "スタッツ偏差値",
  },
  {
    icon: "line-plot",
    key: "line-plot-rank",
    text: "スタッツ順位",
  },
  {
    icon: "setting",
    key: "stats-history",
    text: "スタッツ",
  },
];

const teamCompetitionSeasonFieldDefinition =
  convertFieldDefinition<ModelType.TEAM_COMPETITION_SEASON>(
    ["team"],
    fieldDefinition[ModelType.TEAM_COMPETITION_SEASON],
  );

const competitionStageFieldDefinition =
  convertFieldDefinition<ModelType.COMPETITION_STAGE>(
    ["name", "stage_type", "left"],
    fieldDefinition[ModelType.COMPETITION_STAGE],
  );

const matchFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.MATCH]
>[] = [
  ...convertFieldDefinition<ModelType.MATCH>(
    [
      "date",
      "match_week",
      "competition_stage",
      "home_team",
      "result",
      "away_team",
    ],
    fieldDefinition[ModelType.MATCH],
  ).filter((v) => !["result"].includes(v.key)),
  {
    label: "結果",
    getValueType: ColumnType.CUSTOM,
    key: "result",
    displayOnTable: true,
    getData: (d: MatchGet) => {
      // ゴール数がある場合
      const score =
        d.home_goal !== undefined && d.away_goal !== undefined
          ? `${d.home_goal}-${d.away_goal}`
          : "";

      // PKがある場合
      const pk =
        d.home_pk_goal !== undefined && d.away_pk_goal !== undefined
          ? `(${d.home_pk_goal}PK${d.away_pk_goal})`
          : "";

      return score + pk;
    },
    type: "string",
  },
];

const playerRegistrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.PLAYER_REGISTRATION]
>[] = [
  ...convertFieldDefinition<ModelType.PLAYER_REGISTRATION>(
    ["date", "team", "position_group", "number", "player"],
    fieldDefinition[ModelType.PLAYER_REGISTRATION],
  ),
  {
    label: "抹消",
    key: "registration_status",
    displayOnTable: true,
    getData: (data: PlayerRegistrationGet) => {
      if (data.registration_status === "抹消済み") return "済";
      return "";
    },
    width: "80px",
    getValueType: ColumnType.CUSTOM,
    type: "select",
  },
  {
    label: "2種特指",
    key: "special_type",
    displayOnTable: true,
    getData: (data: PlayerRegistrationGet) => {
      if (data.isSpecialDesignation) return "特別指定";
      if (data.isTypeTwo) return "2種";
      return "";
    },
    width: "100px",
    getValueType: ColumnType.CUSTOM,
    type: "string",
  },
];

const staffRegistrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.STAFF_REGISTRATION]
>[] = [
  ...convertFieldDefinition<ModelType.STAFF_REGISTRATION>(
    ["date", "team", "role", "staff"],
    fieldDefinition[ModelType.STAFF_REGISTRATION],
  ),
  {
    label: "抹消",
    key: "registration_status",
    displayOnTable: true,
    getData: (data: StaffRegistrationGet) => {
      if (data.registration_status === "抹消済み") return "済";
      return "";
    },
    getValueType: ColumnType.CUSTOM,
    type: "select",
  },
];

const seasonFieldDefinition = convertFieldDefinition<ModelType.SEASON>(
  ["name", "start_date", "end_date", "current", "note"],
  fieldDefinition[ModelType.SEASON],
);

const Competition = () => {
  const { id } = useParams();
  const {
    detail: { open },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("teamCompetitionSeason");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useCompetition();

  const [season, setSeason] = useState<Data<SeasonGet>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readSeason = async (competitionId: string) => {
    const obj = await readItemsBase<Season[]>({
      apiInstance: api,
      backendRoute: API_PATHS.SEASON.ROOT,
      params: { competition: competitionId, getAll: true },
      handleLoading: (time) => {
        setSeason((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (!obj) return;

    setSeason({
      data: convert(ModelType.SEASON, obj.data),
      page: obj.page,
      totalCount: obj.totalCount,
      isLoading: true,
    });
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
      await readSeason(id);
    })();
  }, [id]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  type StatsBase = Omit<StatsLGet, RadarKey | "match">;

  type StatsActual = Omit<StatsLGet, "match">;
  type StatsDeviation = StatsBase & {
    [K in RadarKey]?: number;
  };
  type StatsRank = StatsBase & {
    [K in RadarKey]?: number;
  };

  const [selectedSeason, setSelectedSeason] = useState<SeasonGet | null>(null);
  const [statsIsLoading, setStatsIsLoading] = useState<boolean>(false);
  const [statsActual, setStatsActual] = useState<StatsActual[]>([]);
  const [statsDeviation, setStatsDeviation] = useState<StatsDeviation[]>([]);
  const [statsRank, setStatsRank] = useState<StatsRank[]>([]);

  const defaultFields = ["xgFor", "xgAgainst"];

  const statsFields = fieldDefinition[ModelType.STATS_L]
    ?.filter(
      (field): field is UIFieldDefinition<StatsActual> => field.key !== "match",
    )
    .map((f) => {
      if (defaultFields.includes(f.key)) {
        return { ...f, displayOnTable: true };
      }

      return f;
    });

  const readStats = async (seasonId?: string) => {
    if (!seasonId) return setStatsIsLoading(false);
    setStatsIsLoading(true);
    const res = await readItemsBase<StatsL[]>({
      apiInstance: api,
      backendRoute: API_PATHS.STATS_L.ROOT,
      params: {
        getAll: true,
        "match.season": seasonId,
      },
    });

    if (!res?.data) return setStatsIsLoading(false);

    const converted = convert(ModelType.STATS_L, res.data);

    const fields: RadarField[] = radarFields.filter((f) => f.key);

    console.log("converted", converted, fields);

    const tableDatas = buildTableData(
      converted,
      converted,
      fields,
      (d) => d.team.id || "",
    );

    console.log("tableDatas", tableDatas);

    setStatsActual(tableDatas.actual);
    setStatsDeviation(tableDatas.deviation);
    setStatsRank(tableDatas.rank);

    setStatsIsLoading(false);
  };

  useEffect(() => {
    const current = season.data.find((s) => s.current);
    let newSeason = current ? current : season.data[0];
    setSelectedSeason(newSeason);
  }, [season]);

  const handleSetSelectedSeason = (id: string | number | Date | undefined) => {
    const selected = season.data.find((s) => s._id === id) ?? null;
    setSelectedSeason(selected);
  };

  const seasonOptions: OptionArray = useMemo(
    () =>
      season.data.map((s) => ({
        key: s._id,
        label: s.name,
      })),
    [season],
  );

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.COMPETITION, selected._id);
              }}
            >
              {selected.name}
            </div>
            <div className="w-full md:w-50">
              <SelectField
                type="text"
                value={selectedSeason ? selectedSeason?._id : ""}
                options={seasonOptions}
                onChange={handleSetSelectedSeason}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="text-gray-600">{selected.en_name}</div>
            {selected.country.label ? (
              <div className="text-md text-gray-500">{`国：${selected.country.label}`}</div>
            ) : undefined}
            {selected.competition_type ? (
              <div className="text-md text-gray-500">{`大会タイプ：${selected.competition_type}`}</div>
            ) : undefined}
            {selected.category ? (
              <div className="text-md text-gray-500">{`カテゴリ：${selected.category}`}</div>
            ) : undefined}
            {selected.level ? (
              <div className="text-md text-gray-500">{`レベル：${selected.level}`}</div>
            ) : undefined}
            {selected.age_group ? (
              <div className="text-md text-gray-500">{`年代：${selected.age_group}`}</div>
            ) : undefined}
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}

      <SummaryTabMenu
        items={tabItems}
        selectedTab={selectedTab}
        onChange={handleSelectedTab}
      />

      {/* コンテンツ表示 */}
      {selectedTab === "teamCompetitionSeason" && id && selectedSeason && (
        <TableWithFetch
          key={`${selectedTab}-${selectedSeason?._id}`}
          modelType={ModelType.TEAM_COMPETITION_SEASON}
          fieldDefinitions={teamCompetitionSeasonFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
            params: {
              getAll: true,
              competition: id,
              season: selectedSeason?._id,
            },
          }}
          filterField={teamCompetitionSeasonFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={teamCompetitionSeasonFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "competition")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          initialData={{
            formData: { season: selectedSeason?._id },
            metaData: {
              competition: id,
            },
          }}
        />
      )}

      {selectedTab === "competitionStage" && selectedSeason && (
        <TableWithFetch
          key={`${selectedTab}-${selectedSeason?._id}`}
          modelType={ModelType.COMPETITION_STAGE}
          fieldDefinitions={competitionStageFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.COMPETITION_STAGE.ROOT,
            params: { getAll: true, season: selectedSeason?._id },
          }}
          filterField={competitionStageFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={competitionStageFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "competition")}
          initialData={{
            formData: { season: selectedSeason?._id },
            metaData: {
              competition: id,
            },
          }}
        />
      )}

      {selectedTab === "match" && selectedSeason && (
        <TableWithFetch
          key={`${selectedTab}-${selectedSeason?._id}`}
          modelType={ModelType.MATCH}
          fieldDefinitions={matchFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.MATCH.ROOT,
            params: { getAll: true, season: selectedSeason?._id },
          }}
          filterField={matchFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={matchFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "competition")}
          linkField={[
            {
              field: "home_team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            {
              field: "away_team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            {
              field: "result",
              to: APP_ROUTES.MATCH_SUMMARY,
            },
          ]}
          initialData={{
            metaData: {
              season: selectedSeason?._id,
              competition: id,
            },
          }}
        />
      )}

      {selectedTab === "registration" && selectedSeason && (
        <TableWithFetch
          key={`${selectedTab}-${selectedSeason?._id}`}
          modelType={ModelType.PLAYER_REGISTRATION}
          fieldDefinitions={playerRegistrationFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
            params: {
              getAll: true,
              season: selectedSeason._id,
              registration_type: "register",
              sort: "team,position_group_order,number",
            },
          }}
          filterField={playerRegistrationFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={playerRegistrationFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "competition")}
          linkField={[
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
        />
      )}

      {selectedTab === "staff" && selectedSeason && (
        <TableWithFetch
          key={`${selectedTab}-${selectedSeason?._id}`}
          modelType={ModelType.STAFF_REGISTRATION}
          fieldDefinitions={staffRegistrationFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.STAFF_REGISTRATION.ROOT,
            params: {
              getAll: true,
              season: selectedSeason._id,
              registration_type: "register",
              sort: "team",
            },
          }}
          filterField={staffRegistrationFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={staffRegistrationFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "competition")}
          linkField={[
            {
              field: "staff",
              to: APP_ROUTES.STAFF_SUMMARY,
            },
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
        />
      )}

      {selectedTab === "team" && id && (
        <TableWithFetch
          key={`${selectedTab}`}
          modelType={ModelType.SEASON}
          fieldDefinitions={seasonFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.SEASON.ROOT,
            params: {
              getAll: true,
              competition: id,
            },
          }}
          filterField={seasonFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={seasonFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "competition")}
          initialData={{
            formData: { competition: id },
            metaData: { competition: id },
          }}
        />
      )}

      {selectedTab === "pie-plot_1" && id && statsFields && (
        <CustomTableContainer
          pageNum={1}
          items={statsActual}
          newItemsPerPage={20}
          itemsLoading={statsIsLoading}
          fieldDefinitions={statsFields}
          filterField={statsFields.filter(isFilterable)}
          sortField={statsFields?.filter(isSortable)}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          reloadFun={() => readStats(selectedSeason?._id)}
        />
      )}

      {selectedTab === "pie-plot_2" && id && statsFields && (
        <CustomTableContainer
          pageNum={1}
          items={statsDeviation}
          newItemsPerPage={20}
          itemsLoading={statsIsLoading}
          fieldDefinitions={statsFields}
          filterField={statsFields.filter(isFilterable)}
          sortField={statsFields?.filter(isSortable)}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          reloadFun={() => readStats(selectedSeason?._id)}
        />
      )}

      {selectedTab === "line-plot" && id && statsFields && (
        <CustomTableContainer
          pageNum={1}
          items={statsRank}
          newItemsPerPage={20}
          itemsLoading={statsIsLoading}
          fieldDefinitions={statsFields}
          filterField={statsFields.filter(isFilterable)}
          sortField={statsFields?.filter(isSortable)}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          reloadFun={() => readStats(selectedSeason?._id)}
        />
      )}

      {selectedTab === "setting" && selectedSeason && (
        <>
          <TableWithFetch
            key={`${selectedTab}-${selectedSeason?._id}`}
            modelType={ModelType.STATS_L}
            fieldDefinitions={fieldDefinition[ModelType.STATS_L] || []}
            fetch={{
              apiRoute: API_PATHS.STATS_L.ROOT,
              params: {
                getAll: true,
                "match.season": selectedSeason._id,
                registration_type: "register",
                sort: "team, match.date",
              },
            }}
            filterField={fieldDefinition[ModelType.STATS_L]?.filter(
              isFilterable,
            )}
            sortField={fieldDefinition[ModelType.STATS_L]?.filter(isSortable)}
            linkField={[
              {
                field: "match",
                to: APP_ROUTES.MATCH_SUMMARY,
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default Competition;
