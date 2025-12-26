import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TableWithFetch } from "../../components/table";
import { ModelType } from "../../types/models";
import { CompetitionTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { API_PATHS } from "@dai0413/myorg-shared";
import { convert } from "../../lib/convert/DBtoGetted";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useCompetition } from "../../context/models/competition";
import { Season, SeasonGet } from "../../types/models/season";
import { MatchGet } from "../../types/models/match";
import { toDateKey } from "../../utils";
import { Data } from "../../types/types";
import { PlayerRegistrationGet } from "../../types/models/player-registration";
import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { ResBody } from "@dai0413/myorg-shared";

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
  const { resetFilterConditions } = useFilter();
  const { resetSort } = useSort();

  const [selectedTab, setSelectedTab] = useState("teamCompetitionSeason");

  const [reloadKey, setReloadKey] = useState(0);

  const {
    metacrud: { selected, readItem, isLoading },
  } = useCompetition();

  const [season, setSeason] = useState<Data<SeasonGet>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readSeason = (competitionId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_PATHS.SEASON.ROOT,
      params: { competition: competitionId, getAll: true },
      onSuccess: (resBody: ResBody<Season[]>) => {
        setSeason({
          data: convert(ModelType.SEASON, resBody.data),
          page: resBody.page ? resBody.page : 1,
          totalCount: resBody.totalCount ? resBody.totalCount : 1,
          isLoading: true,
        });
      },
      handleLoading: (time) => {
        setSeason((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
      await readSeason(id);
      setReloadKey((prev) => prev + 1);
    })();
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    resetFilterConditions();
    resetSort([]);
    setSelectedTab(value as string);
  };

  const [selectedSeason, setSelectedSeason] = useState<SeasonGet | null>(null);

  useEffect(() => {
    const current = season.data.find((s) => s.current);
    let newSeason = current ? current : season.data[0];
    setSelectedSeason(newSeason);
  }, [season]);

  const handleSetSelectedSeason = (id: string | number | Date) => {
    const selected = season.data.find((s) => s._id === id) ?? null;
    setSelectedSeason(selected);
  };

  const seasonOptions: OptionArray = useMemo(
    () =>
      season.data.map((s) => ({
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
      {selectedTab === "teamCompetitionSeason" && id && selectedSeason && (
        <TableWithFetch
          modelType={ModelType.TEAM_COMPETITION_SEASON}
          headers={[{ label: "チーム", field: "team" }]}
          fetch={{
            apiRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
            params: {
              getAll: true,
              competition: id,
              season: selectedSeason?._id,
            },
          }}
          filterField={fieldDefinition[ModelType.TEAM_COMPETITION_SEASON]
            .filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={fieldDefinition[ModelType.TEAM_COMPETITION_SEASON]
            .filter(isSortable)
            .filter((file) => file.key !== "competition")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          reloadTrigger={reloadKey}
          formInitialData={{
            season: selectedSeason?._id,
          }}
        />
      )}

      {selectedTab === "competitionStage" && selectedSeason && (
        <TableWithFetch
          modelType={ModelType.COMPETITION_STAGE}
          headers={[
            { label: "名前", field: "name", width: "170px" },
            { label: "ステージタイプ", field: "stage_type", width: "100px" },
            { label: "LEG", field: "leg", width: "50px" },
          ]}
          fetch={{
            apiRoute: API_PATHS.COMPETITION_STAGE.ROOT,
            params: { getAll: true, season: selectedSeason?._id },
          }}
          filterField={fieldDefinition[ModelType.COMPETITION_STAGE]
            .filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={fieldDefinition[ModelType.COMPETITION_STAGE]
            .filter(isSortable)
            .filter((file) => file.key !== "competition")}
          reloadTrigger={reloadKey}
          formInitialData={{
            season: selectedSeason?._id,
          }}
        />
      )}

      {selectedTab === "match" && selectedSeason && (
        <TableWithFetch
          modelType={ModelType.MATCH}
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
          fetch={{
            apiRoute: API_PATHS.MATCH.ROOT,
            params: { getAll: true, season: selectedSeason?._id },
          }}
          filterField={fieldDefinition[ModelType.MATCH]
            .filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={fieldDefinition[ModelType.MATCH]
            .filter(isSortable)
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
          ]}
          reloadTrigger={reloadKey}
        />
      )}

      {selectedTab === "registration" && selectedSeason && (
        <TableWithFetch
          modelType={ModelType.PLAYER_REGISTRATION}
          headers={[
            { label: "チーム", field: "team" },
            { label: "ポジション", field: "position_group", width: "100px" },
            {
              label: "背番号",
              field: "number",
              getData: (data: PlayerRegistrationGet) => {
                return data.number ? String(data.number) : "";
              },
              width: "80px",
            },
            { label: "選手", field: "player", isPrimary: true },
            {
              label: "抹消",
              field: "registration_status",
              getData: (data: PlayerRegistrationGet) => {
                if (data.registration_status === "抹消済み") return "済";
                return "";
              },
              width: "80px",
            },
            {
              label: "2種特指",
              field: "special_type",
              getData: (data: PlayerRegistrationGet) => {
                if (data.isSpecialDesignation) return "特別指定";
                if (data.isTypeTwo) return "2種";
                return "";
              },
              width: "100px",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
            params: {
              getAll: true,
              season: selectedSeason._id,
              registration_type: "register",
              sort: "team,position_group_order,number",
            },
          }}
          filterField={fieldDefinition[ModelType.PLAYER_REGISTRATION]
            .filter(isFilterable)
            .filter((file) => file.key !== "competition")}
          sortField={fieldDefinition[ModelType.PLAYER_REGISTRATION]
            .filter(isSortable)
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
          reloadTrigger={reloadKey}
        />
      )}
    </div>
  );
};

export default Competition;
