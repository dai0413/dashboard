import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../components/table";
import { ModelType } from "../../types/models";
import { CompetitionTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../../types/field";
import { readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { APP_ROUTES } from "../../lib/appRoutes";
import {
  TeamCompetitionSeason,
  TeamCompetitionSeasonGet,
} from "../../types/models/team-competition-season";
import { useCompetition } from "../../context/models/competition";
import { Season, SeasonGet } from "../../types/models/season";
import {
  CompetitionStage,
  CompetitionStageGet,
} from "../../types/models/competition-stage";
import { useForm } from "../../context/form-context";
import { Match, MatchGet } from "../../types/models/match";
import { toDateKey } from "../../utils";
import { useMatch } from "../../context/models/match";
import { useQuery } from "../../context/query-context";
import { QueryParams } from "../../lib/api/readItems";

const Tabs = CompetitionTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const Competition = () => {
  const api = useApi();
  const { id } = useParams();
  const { isOpen: formIsOpen } = useForm();
  const { page, setPage } = useQuery();

  const handlePageChange = (page: number) => {
    setPage("page", page);
  };

  const [selectedTab, setSelectedTab] = useState("teamCompetitionSeason");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useCompetition();

  const [teamCompetitionSeason, setTeamCompetitionSeason] = useState<
    TeamCompetitionSeasonGet[]
  >([]);
  const [teamCompetitionSeasonIsLoading, setTeamCompetitionSeasonIsLoading] =
    useState<boolean>(false);

  const [season, setSeason] = useState<SeasonGet[]>([]);
  const [_seasonIsLoading, setSeasonIsLoading] = useState<boolean>(false);

  const [competitionStage, setCompetitionStage] = useState<
    CompetitionStageGet[]
  >([]);
  const [competitionStageIsLoading, setCompetitionStageIsLoading] =
    useState<boolean>(false);

  const [match, setMatch] = useState<MatchGet[]>([]);
  const [matchIsLoading, setMatcIsLoading] = useState<boolean>(false);

  const isLoadingSetters = {
    teamCompetitionSeason: setTeamCompetitionSeasonIsLoading,
    season: setSeasonIsLoading,
    competitionStage: setCompetitionStageIsLoading,
    match: setMatcIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const readTeamCompetitionSeason = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM_COMPETITION_SEASON.GET_ALL,
      params,
      onSuccess: (items: TeamCompetitionSeason[]) => {
        setTeamCompetitionSeason(
          convert(ModelType.TEAM_COMPETITION_SEASON, items)
        );
      },
      handleLoading: (time) => setLoading(time, "teamCompetitionSeason"),
    });

  const readSeason = (competitionId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.SEASON.GET_ALL,
      params: { competition: competitionId },
      onSuccess: (items: Season[]) => {
        setSeason(convert(ModelType.SEASON, items));
      },
      handleLoading: (time) => setLoading(time, "season"),
    });

  const readCompetitionStage = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.COMPETITION_STAGE.GET_ALL,
      params,
      onSuccess: (items: CompetitionStage[]) => {
        setCompetitionStage(convert(ModelType.COMPETITION_STAGE, items));
      },
      handleLoading: (time) => setLoading(time, "competitionStage"),
    });

  const readMatch = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.MATCH.GET_ALL,
      params,
      onSuccess: (items: Match[]) => {
        setMatch(convert(ModelType.MATCH, items));
      },
      handleLoading: (time) => setLoading(time, "match"),
    });

  useEffect(() => {
    if (!id) return;
    (async () => {
      readItem(id);
      readSeason(id);
    })();
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    handlePageChange(1);
    setSelectedTab(value as string);
  };

  const teamCompetitionSeasonOptions = {
    filterField: ModelType.TEAM_COMPETITION_SEASON
      ? (fieldDefinition[ModelType.TEAM_COMPETITION_SEASON]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "competition"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.TEAM_COMPETITION_SEASON
      ? (fieldDefinition[ModelType.TEAM_COMPETITION_SEASON]
          .filter(isSortable)
          .filter(
            (file) => file.key !== "competition"
          ) as SortableFieldDefinition[])
      : [],
  };

  const competitionStageOptions = {
    filterField: ModelType.COMPETITION_STAGE
      ? (fieldDefinition[ModelType.COMPETITION_STAGE]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "competition"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.COMPETITION_STAGE
      ? (fieldDefinition[ModelType.COMPETITION_STAGE]
          .filter(isSortable)
          .filter(
            (file) => file.key !== "competition"
          ) as SortableFieldDefinition[])
      : [],
  };

  const matchOptions = {
    filterField: ModelType.MATCH
      ? (fieldDefinition[ModelType.MATCH]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "competition"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.MATCH
      ? (fieldDefinition[ModelType.MATCH]
          .filter(isSortable)
          .filter(
            (file) => file.key !== "competition"
          ) as SortableFieldDefinition[])
      : [],
  };

  const [selectedSeason, setSelectedSeason] = useState<SeasonGet | null>(null);

  useEffect(() => {
    const current = season.find((s) => s.current);
    let newSeason = current ? current : season[0];
    setSelectedSeason(newSeason);
  }, [season]);

  useEffect(() => {
    if (!id || !season.length || !selectedSeason) return;

    readTeamCompetitionSeason({
      competition: id,
      season: selectedSeason._id,
    });

    readCompetitionStage({ season: selectedSeason._id });
    readMatch({
      season: selectedSeason._id,
    });
  }, [selectedSeason?._id, formIsOpen]);

  const handleSetSelectedSeason = (id: string | number | Date) => {
    const selected = season.find((s) => s._id === id) ?? null;
    setSelectedSeason(selected);
  };

  const seasonOptions: OptionArray = useMemo(
    () =>
      season.map((s) => ({
        key: s._id,
        label: s.name,
      })),
    [season]
  );

  const formInitialData = useMemo(() => {
    if (!selectedSeason) return {};
    return { season: selectedSeason._id };
  }, [selectedSeason?._id]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="font-bold text-lg">{selected.name}</div>
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
            {CompetitionTabItems.map(({ icon, text, className }) => {
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
      {selectedTab === "teamCompetitionSeason" && (
        <TableContainer
          items={teamCompetitionSeason}
          headers={[{ label: "チーム", field: "team" }]}
          modelType={ModelType.TEAM_COMPETITION_SEASON}
          originalFilterField={teamCompetitionSeasonOptions.filterField}
          originalSortField={teamCompetitionSeasonOptions.sortField}
          formInitialData={formInitialData}
          itemsLoading={teamCompetitionSeasonIsLoading}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTab === "competitionStage" && (
        <TableContainer
          items={competitionStage}
          headers={[
            { label: "名前", field: "name", width: "170px" },
            { label: "ステージタイプ", field: "stage_type", width: "100px" },
            { label: "LEG", field: "leg", width: "50px" },
          ]}
          modelType={ModelType.COMPETITION_STAGE}
          originalFilterField={competitionStageOptions.filterField}
          originalSortField={competitionStageOptions.sortField}
          formInitialData={formInitialData}
          itemsLoading={competitionStageIsLoading}
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTab === "match" && (
        <TableContainer
          items={match}
          headers={[
            {
              label: "開催日",
              field: "date",
              getData: (d: MatchGet) =>
                d.date ? toDateKey(new Date(d.date)) : "",
            },
            { label: "節", field: "match_week", width: "80px" },
            { label: "ステージ", field: "competition_stage", width: "100px" },
            { label: "ホーム", field: "home_team" },
            {
              label: "結果",
              field: "result",
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
            },
            { label: "アウェイ", field: "away_team" },
          ]}
          modelType={ModelType.MATCH}
          originalFilterField={matchOptions.filterField}
          originalSortField={matchOptions.sortField}
          formInitialData={formInitialData}
          itemsLoading={matchIsLoading}
          linkField={[
            {
              field: "home_team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            {
              field: "away_team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          uploadFile={useMatch().metacrud.uploadFile}
          reloadFun={
            selectedSeason
              ? () => readMatch({ match: selectedSeason._id })
              : undefined
          }
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Competition;
