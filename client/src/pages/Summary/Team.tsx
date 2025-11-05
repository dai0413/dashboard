import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TableWithFetch } from "../../components/table";

import { ModelType } from "../../types/models";
import { TeamTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { useTeam } from "../../context/models/team";
import { readItemBase, readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { useForm } from "../../context/form-context";
import { APP_ROUTES } from "../../lib/appRoutes";
import {
  TeamCompetitionSeason,
  TeamCompetitionSeasonGet,
} from "../../types/models/team-competition-season";
import { MatchGet } from "../../types/models/match";
import { toDateKey } from "../../utils";
import { Season, SeasonGet } from "../../types/models/season";
import { QueryParams, ResBody } from "../../lib/api/readItems";
import { Data } from "../../types/types";

const Tabs = TeamTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const Team = () => {
  const api = useApi();
  const { id } = useParams();

  const { isOpen: formIsOpen } = useForm();

  const [selectedTab, setSelectedTab] = useState("player");

  const {
    metacrud: { selected, readItem, isLoading: teamIsLoading },
  } = useTeam();

  const [teamCompetitionSeason, setTeamCompetitionSeason] = useState<
    Data<TeamCompetitionSeasonGet>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const [season, setSeason] = useState<SeasonGet | null>(null);

  const readSeason = (seasonId: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.SEASON.DETAIL(seasonId),
      onSuccess: (item: Season) => {
        setSeason(convert(ModelType.SEASON, item));
      },
    });

  const readTeamCompetitionSeason = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM_COMPETITION_SEASON.GET_ALL,
      params,
      onSuccess: (resBody: ResBody<TeamCompetitionSeason>) => {
        setTeamCompetitionSeason({
          data: convert(ModelType.TEAM_COMPETITION_SEASON, resBody.data),
          page: resBody.page,
          totalCount: resBody.totalCount,
          isLoading: true,
        });
      },
      handleLoading: (time) =>
        setTeamCompetitionSeason((prev) => ({
          ...prev,
          isLoading: time === "start",
        })),
    });

  useEffect(() => {
    if (!id) return;
    (async () => {
      readItem(id);
      readTeamCompetitionSeason({
        team: id,
        "competition.category": "league",
        "competition.level": "exists",
        getAll: true,
      });
    })();
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const [selectedteamCompetitionSeason, setSelectedTeamCompetitionSeason] =
    useState<TeamCompetitionSeasonGet | null>(null);

  useEffect(() => {
    const current = teamCompetitionSeason.data[0];
    setSelectedTeamCompetitionSeason(current);
  }, [teamCompetitionSeason]);

  useEffect(() => {
    const seasonId = selectedteamCompetitionSeason?.season.id;
    if (!seasonId) return;
    (async () => {
      readSeason(seasonId);
    })();
  }, [selectedteamCompetitionSeason?._id, formIsOpen]);

  const handleSetSelectedSeason = (id: string | number | Date) => {
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
    [teamCompetitionSeason]
  );

  const seasonDates = useMemo(() => {
    if (!season)
      return {
        startDate: undefined,
        endDate: undefined,
        oneYearLater: undefined,
        seasonRange: [],
      };

    const startDate = season?.start_date
      ? toDateKey(new Date(season?.start_date).toISOString())
      : undefined;

    const endDate = season?.end_date
      ? toDateKey(new Date(season?.end_date).toISOString())
      : undefined;

    const oneYearLater = season?.start_date
      ? toDateKey(
          new Date(
            new Date(season?.start_date).setFullYear(
              new Date(season?.start_date).getFullYear() + 2
            )
          ).toISOString()
        )
      : undefined;

    const seasonRange: string[] = [];
    if (startDate) seasonRange.push(`>=${startDate}`);
    if (endDate) seasonRange.push(`<=${endDate}`);

    return { startDate, endDate, oneYearLater, seasonRange };
  }, [season]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!teamIsLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="font-bold text-lg">{selected.team}</div>
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
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
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
      {selectedTab === "player" && id && (
        // <TableContainer
        //   items={players}
        //   headers={[
        //     { label: "背番号", field: "number", width: "70px" },
        //     { label: "選手", field: "player" },
        //     { label: "ポジション", field: "position", width: "70px" },
        //   ]}
        //   modelType={ModelType.TRANSFER}
        //   originalFilterField={inTransfersOptions.filterField}
        //   originalSortField={inTransfersOptions.sortField}
        //   formInitialData={{ to_team: id }}
        //   itemsLoading={playersIsLoading}
        //   linkField={[
        //     {
        //       field: "player",
        //       to: APP_ROUTES.PLAYER_SUMMARY,
        //     },
        //   ]}
        //   pageNum={page.page}
        //   handlePageChange={handlePageChange}
        // />
        <TableWithFetch
          modelType={ModelType.TRANSFER}
          headers={[
            { label: "背番号", field: "number", width: "70px" },
            { label: "選手", field: "player" },
            { label: "ポジション", field: "position", width: "70px" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.TRANSFER.GET_ALL,
            params: {
              from_date: seasonDates.seasonRange,
              to_team: id,
              sort: "number",
              form: ["!期限付き満了"],
            },
          }}
          filterField={fieldDefinition[ModelType.TRANSFER]
            .filter(isFilterable)
            .filter((file) => file.key !== "to_team")}
          sortField={fieldDefinition[ModelType.TRANSFER]
            .filter(isSortable)
            .filter((file) => file.key !== "to_team")}
          linkField={[
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
          formInitialData={{ to_team: id }}
        />
      )}

      {selectedTab === "future_in" && id && (
        <TableWithFetch
          modelType={ModelType.TRANSFER}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍元", field: "from_team" },
            { label: "ポジション", field: "position" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.TRANSFER.GET_ALL,
            params: {
              from_date: [
                `>${seasonDates.endDate}`,
                `<${seasonDates.oneYearLater}`,
              ].filter((t) => t !== undefined),
              to_team: id,
              "from_team.age_group": "!full",
              from_team: `exists`,
            },
          }}
          filterField={fieldDefinition[ModelType.TRANSFER]
            .filter(isFilterable)
            .filter((file) => file.key !== "to_team")}
          sortField={fieldDefinition[ModelType.TRANSFER]
            .filter(isSortable)
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
          formInitialData={{ to_team: id }}
        />
        // <TableContainer
        //   items={futurePlayers}
        //   headers={[
        //     { label: "加入日", field: "from_date" },
        //     { label: "選手", field: "player" },
        //     { label: "移籍元", field: "from_team" },
        //     { label: "ポジション", field: "position" },
        //   ]}
        //   modelType={ModelType.TRANSFER}
        //   originalFilterField={inTransfersOptions.filterField}
        //   originalSortField={inTransfersOptions.sortField}
        //   formInitialData={{ to_team: id }}
        //   itemsLoading={futurePlayersIsLoading}
        //   linkField={[
        //     {
        //       field: "player",
        //       to: APP_ROUTES.PLAYER_SUMMARY,
        //     },
        //     {
        //       field: "from_team",
        //       to: APP_ROUTES.TEAM_SUMMARY,
        //     },
        //   ]}
        //   pageNum={page.page}
        //   handlePageChange={handlePageChange}
        // />
      )}

      {selectedTab === "transfer_in" && id && (
        <TableWithFetch
          modelType={ModelType.TRANSFER}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍元", field: "from_team" },
            { label: "形態", field: "form" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.TRANSFER.GET_ALL,
            params: {
              to_team: id,
              form: "!更新",
              from_date: seasonDates.seasonRange,
            },
          }}
          filterField={fieldDefinition[ModelType.TRANSFER]
            .filter(isFilterable)
            .filter((file) => file.key !== "to_team")}
          sortField={fieldDefinition[ModelType.TRANSFER]
            .filter(isSortable)
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
          formInitialData={{ to_team: id }}
        />
        // <TableContainer
        //   items={inTransfers}
        //   headers={[
        //     { label: "加入日", field: "from_date" },
        //     { label: "選手", field: "player" },
        //     { label: "移籍元", field: "from_team" },
        //     { label: "形態", field: "form" },
        //   ]}
        //   modelType={ModelType.TRANSFER}
        //   originalFilterField={inTransfersOptions.filterField}
        //   originalSortField={inTransfersOptions.sortField}
        //   formInitialData={{ to_team: id }}
        //   itemsLoading={inTransfersIsLoading}
        //   linkField={[
        //     {
        //       field: "player",
        //       to: APP_ROUTES.PLAYER_SUMMARY,
        //     },
        //     {
        //       field: "from_team",
        //       to: APP_ROUTES.TEAM_SUMMARY,
        //     },
        //   ]}
        //   pageNum={page.page}
        //   handlePageChange={handlePageChange}
        // />
      )}

      {selectedTab === "transfer_out" && id && (
        <TableWithFetch
          modelType={ModelType.TRANSFER}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.TRANSFER.GET_ALL,
            params: { from_team: id, from_date: seasonDates.seasonRange },
          }}
          filterField={fieldDefinition[ModelType.TRANSFER]
            .filter(isFilterable)
            .filter((file) => file.key !== "from_team")}
          sortField={fieldDefinition[ModelType.TRANSFER]
            .filter(isSortable)
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
          formInitialData={{ from_team: id }}
        />
        // <TableContainer
        //   items={outTransfers}
        //   headers={[
        //     { label: "加入日", field: "from_date" },
        //     { label: "選手", field: "player" },
        //     { label: "移籍先", field: "to_team" },
        //     { label: "形態", field: "form" },
        //   ]}
        //   modelType={ModelType.TRANSFER}
        //   originalFilterField={outTransfersOptions.filterField}
        //   originalSortField={outTransfersOptions.sortField}
        //   formInitialData={{ from_team: id }}
        //   itemsLoading={outTransfersIsLoading}
        //   linkField={[
        //     {
        //       field: "player",
        //       to: APP_ROUTES.PLAYER_SUMMARY,
        //     },
        //     {
        //       field: "to_team",
        //       to: APP_ROUTES.TEAM_SUMMARY,
        //     },
        //   ]}
        //   pageNum={page.page}
        //   handlePageChange={handlePageChange}
        // />
      )}

      {selectedTab === "loan" && id && (
        <TableWithFetch
          modelType={ModelType.TRANSFER}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.TRANSFER.GET_ALL,
            params: {
              from_team: id,
              form: ["期限付き", "育成型期限付き"],
              from_date: seasonDates.seasonRange,
            },
          }}
          filterField={fieldDefinition[ModelType.TRANSFER]
            .filter(isFilterable)
            .filter((file) => file.key !== "to_team")}
          sortField={fieldDefinition[ModelType.TRANSFER]
            .filter(isSortable)
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
          formInitialData={{ from_team: id }}
        />
        // <TableContainer
        //   items={onLoan}
        //   headers={[
        //     { label: "加入日", field: "from_date" },
        //     { label: "選手", field: "player" },
        //     { label: "移籍先", field: "to_team" },
        //     { label: "形態", field: "form" },
        //   ]}
        //   modelType={ModelType.TRANSFER}
        //   originalFilterField={outTransfersOptions.filterField}
        //   originalSortField={outTransfersOptions.sortField}
        //   formInitialData={{ from_team: id }}
        //   itemsLoading={onLoanIsLoading}
        //   linkField={[
        //     {
        //       field: "player",
        //       to: APP_ROUTES.PLAYER_SUMMARY,
        //     },
        //     {
        //       field: "to_team",
        //       to: APP_ROUTES.TEAM_SUMMARY,
        //     },
        //   ]}
        //   pageNum={page.page}
        //   handlePageChange={handlePageChange}
        // />
      )}

      {selectedTab === "injury" && id && (
        <TableWithFetch
          modelType={ModelType.INJURY}
          headers={[
            { label: "発表日", field: "doa" },
            { label: "選手", field: "player" },
            { label: "負傷箇所・診断結果", field: "injured_part" },
            { label: "全治", field: "ttp" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.INJURY.GET_ALL,
            params: { team: id, doa: seasonDates.seasonRange },
          }}
          filterField={fieldDefinition[ModelType.INJURY]
            .filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={fieldDefinition[ModelType.INJURY]
            .filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
          formInitialData={{ team: id }}
        />
        // <TableContainer
        //   items={injuries}
        //   headers={[
        //     { label: "発表日", field: "doa" },
        //     { label: "選手", field: "player" },
        //     { label: "負傷箇所・診断結果", field: "injured_part" },
        //     { label: "全治", field: "ttp" },
        //   ]}
        //   modelType={ModelType.INJURY}
        //   originalFilterField={injuryOptions.filterableField}
        //   originalSortField={injuryOptions.sortField}
        //   formInitialData={injuryFormInitialData}
        //   itemsLoading={injuriesIsLoading}
        //   linkField={[
        //     {
        //       field: "player",
        //       to: APP_ROUTES.PLAYER_SUMMARY,
        //     },
        //   ]}
        //   pageNum={page.page}
        //   handlePageChange={handlePageChange}
        // />
      )}

      {selectedTab === "match" && id && (
        <TableWithFetch
          modelType={ModelType.MATCH}
          headers={[
            {
              label: "開催日",
              field: "date",
              getData: (d: MatchGet) =>
                d.date ? toDateKey(new Date(d.date)) : "",
            },
            { label: "大会", field: "competition" },
            { label: "ステージ", field: "competition_stage" },
            { label: "節", field: "match_week", width: "80px" },
            {
              label: "相手",
              field: "vsTeam",
              getData: (d: MatchGet) => {
                const isHome = d.home_team.id === id;
                const vsTeam = isHome ? d.away_team : d.home_team;

                return vsTeam;
              },
            },
            {
              label: "結果",
              field: "result",
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
            },
          ]}
          fetch={{
            apiRoute: API_ROUTES.MATCH.GET_ALL,
            params: { team: id, date: seasonDates.seasonRange, sort: "date" },
          }}
          filterField={fieldDefinition[ModelType.MATCH].filter(isFilterable)}
          sortField={fieldDefinition[ModelType.MATCH].filter(isSortable)}
          linkField={[
            { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
            { field: "vsTeam", to: APP_ROUTES.TEAM_SUMMARY },
          ]}
        />
        // <TableContainer
        //   items={match}
        //   headers={[
        //     {
        //       label: "開催日",
        //       field: "date",
        //       getData: (d: MatchGet) =>
        //         d.date ? toDateKey(new Date(d.date)) : "",
        //     },
        //     { label: "大会", field: "competition" },
        //     { label: "ステージ", field: "competition_stage" },
        //     { label: "節", field: "match_week", width: "80px" },
        //     {
        //       label: "相手",
        //       field: "vsTeam",
        //       getData: (d: MatchGet) => {
        //         const isHome = d.home_team.id === id;
        //         const vsTeam = isHome ? d.away_team : d.home_team;

        //         return vsTeam;
        //       },
        //     },
        //     {
        //       label: "結果",
        //       field: "result",
        //       getData: (d: MatchGet) => {
        //         const isHome = d.home_team.id === id;
        //         const goal = isHome ? d.home_goal : d.away_goal;
        //         const againstGoal = isHome ? d.away_goal : d.home_goal;
        //         const pkGoal = isHome ? d.home_pk_goal : d.away_pk_goal;
        //         const againstPkGoal = isHome ? d.away_pk_goal : d.home_pk_goal;

        //         const score =
        //           goal !== undefined && againstGoal !== undefined
        //             ? `${goal}-${againstGoal}`
        //             : "";

        //         const pk =
        //           pkGoal !== undefined && againstPkGoal !== undefined
        //             ? `(${pkGoal}PK${againstPkGoal})`
        //             : "";

        //         return score + pk;
        //       },
        //     },
        //   ]}
        //   modelType={ModelType.MATCH}
        //   originalFilterField={matchOptions.filterField}
        //   originalSortField={matchOptions.sortField}
        //   itemsLoading={matchIsLoading}
        //   linkField={[
        //     { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
        //     { field: "vsTeam", to: APP_ROUTES.TEAM_SUMMARY },
        //   ]}
        //   pageNum={page.page}
        //   handlePageChange={handlePageChange}
        // />
      )}
    </div>
  );
};

export default Team;
