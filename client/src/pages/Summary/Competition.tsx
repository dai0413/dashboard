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
import { useCompetition } from "../../context/models/competition-context";
import { Season, SeasonGet } from "../../types/models/season";

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
  const [_seasonIsLoading, setSeasonIsLoading] = useState(false);

  const isLoadingSetters = {
    teamCompetitionSeason: setTeamCompetitionSeasonIsLoading,
    season: setSeasonIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const readTeamCompetitionSeason = (competitionId: string, seasonId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM_COMPETITION_SEASON.GET_ALL,
      params: {
        competition: competitionId,
        season: seasonId,
      },
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

  useEffect(() => {
    if (!id) return;
    (async () => {
      readItem(id);
      readSeason(id);
    })();
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
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

  const [selectedSeason, setSelectedSeason] = useState<SeasonGet | null>(null);

  useEffect(() => {
    const newSeason = season.find((s) => s.current) || null;
    setSelectedSeason(newSeason);
  }, [season]);

  useEffect(() => {
    if (!id || !season.length || !selectedSeason) return;
    readTeamCompetitionSeason(id, selectedSeason._id);
  }, [selectedSeason?._id]);

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="font-bold text-lg">{selected.name}</div>
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

            <div className="w-full md:w-50">
              <SelectField
                type="text"
                value={selectedSeason ? selectedSeason?._id : ""}
                options={seasonOptions}
                onChange={handleSetSelectedSeason}
              />
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
            {CompetitionTabItems.map(({ icon, text, className }) => {
              const isActive = selectedTab === icon;
              return (
                <li key={text}>
                  <IconButton
                    icon={icon}
                    text={text}
                    color={isActive ? "green" : "gray"}
                    onClick={() => icon && setSelectedTab(icon)}
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
          formInitialData={{}}
          itemsLoading={teamCompetitionSeasonIsLoading}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
        />
      )}
    </div>
  );
};

export default Competition;
