import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../components/table";

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
import { Transfer, TransferGet } from "../../types/models/transfer";
import { convert } from "../../lib/convert/DBtoGetted";
import { Injury, InjuryGet } from "../../types/models/injury";
import { useForm } from "../../context/form-context";
import { APP_ROUTES } from "../../lib/appRoutes";
import {
  TeamCompetitionSeason,
  TeamCompetitionSeasonGet,
} from "../../types/models/team-competition-season";
import { Match, MatchGet } from "../../types/models/match";
import { toDateKey } from "../../utils";
import { useQuery } from "../../context/query-context";
import { Season, SeasonGet } from "../../types/models/season";
import { QueryParams, ResBody } from "../../lib/api/readItems";

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
  const { page, setPage } = useQuery();

  const handlePageChange = (page: number) => {
    setPage("page", page);
  };

  const { isOpen: formIsOpen } = useForm();

  const [selectedTab, setSelectedTab] = useState("player");

  const {
    metacrud: { selected, readItem, isLoading: teamIsLoading },
  } = useTeam();

  const [players, setPlayers] = useState<TransferGet[]>([]);
  const [playersIsLoading, setPlayersIsLoading] = useState<boolean>(false);
  const [inTransfers, setInTransfers] = useState<TransferGet[]>([]);
  const [inTransfersIsLoading, setInTransfersIsLoading] =
    useState<boolean>(false);
  const [outTransfers, setOutTransfers] = useState<TransferGet[]>([]);
  const [outTransfersIsLoading, setOutTransfersIsLoading] =
    useState<boolean>(false);
  const [onLoan, setOnLoan] = useState<TransferGet[]>([]);
  const [onLoanIsLoading, setOnLoanIsLoading] = useState<boolean>(false);
  const [futurePlayers, setFuturePlayers] = useState<TransferGet[]>([]);
  const [futurePlayersIsLoading, setFuturePlayersIsLoading] =
    useState<boolean>(false);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);
  const [injuriesIsLoading, setInjuriesIsLoading] = useState<boolean>(false);
  const [teamCompetitionSeason, setTeamCompetitionSeason] = useState<
    TeamCompetitionSeasonGet[]
  >([]);
  const [_teamCompetitionSeasonIsLoading, setTeamCompetitionSeasonIsLoading] =
    useState<boolean>(false);
  const [match, setMatch] = useState<MatchGet[]>([]);
  const [matchIsLoading, setMatcIsLoading] = useState<boolean>(false);

  const [season, setSeason] = useState<SeasonGet | null>(null);

  const isLoadingSetters = {
    player: setPlayersIsLoading,
    in: setInTransfersIsLoading,
    out: setOutTransfersIsLoading,
    loan: setOnLoanIsLoading,
    future: setFuturePlayersIsLoading,
    injury: setInjuriesIsLoading,
    teamCompetitionSeason: setTeamCompetitionSeasonIsLoading,
    match: setMatcIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const readSeason = (seasonId: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.SEASON.DETAIL(seasonId),
      onSuccess: (item: Season) => {
        setSeason(convert(ModelType.SEASON, item));
      },
    });

  const readPlayers = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params,
      onSuccess: (resBody: ResBody<Transfer>) => {
        setPlayers(convert(ModelType.TRANSFER, resBody.data));
      },
      handleLoading: (time) => setLoading(time, "player"),
    });

  const readFuturePlayers = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params,
      onSuccess: (resBody: ResBody<Transfer>) => {
        setFuturePlayers(convert(ModelType.TRANSFER, resBody.data));
      },
      handleLoading: (time) => setLoading(time, "future"),
    });

  const readCurrentLoans = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params,
      onSuccess: (resBody: ResBody<Transfer>) => {
        setOnLoan(convert(ModelType.TRANSFER, resBody.data));
      },
      handleLoading: (time) => setLoading(time, "loan"),
    });

  const readTransfers = (
    params: QueryParams,
    onSuccess: (resBody: ResBody<Transfer>) => void,
    type: "in" | "out"
  ) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params,
      onSuccess,
      handleLoading: (time) => setLoading(time, type),
    });

  const readInjuries = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.GET_ALL,
      params,
      onSuccess: (resBody: ResBody<Injury>) => {
        setInjuries(convert(ModelType.INJURY, resBody.data));
      },
      handleLoading: (time) => setLoading(time, "injury"),
    });

  const readTeamCompetitionSeason = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM_COMPETITION_SEASON.GET_ALL,
      params,
      onSuccess: (resBody: ResBody<TeamCompetitionSeason>) => {
        setTeamCompetitionSeason(
          convert(ModelType.TEAM_COMPETITION_SEASON, resBody.data)
        );
      },
      handleLoading: (time) => setLoading(time, "teamCompetitionSeason"),
    });

  const readMatch = (params: QueryParams) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.MATCH.GET_ALL,
      params,
      onSuccess: (resBody: ResBody<Match>) => {
        setMatch(convert(ModelType.MATCH, resBody.data));
      },
      handleLoading: (time) => setLoading(time, "match"),
    });

  useEffect(() => {
    if (!id) return;
    (async () => {
      readItem(id);
      readTeamCompetitionSeason({
        team: id,
        "competition.category": "league",
      });
    })();
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const inTransfersOptions = {
    filterField: ModelType.TRANSFER
      ? fieldDefinition[ModelType.TRANSFER]
          .filter(isFilterable)
          .filter((file) => file.key !== "to_team")
      : [],
    sortField: ModelType.TRANSFER
      ? fieldDefinition[ModelType.TRANSFER]
          .filter(isSortable)
          .filter((file) => file.key !== "to_team")
      : [],
  };

  const outTransfersOptions = {
    filterField: ModelType.TRANSFER
      ? fieldDefinition[ModelType.TRANSFER]
          .filter(isFilterable)
          .filter((file) => file.key !== "from_team")
      : [],
    sortField: ModelType.TRANSFER
      ? fieldDefinition[ModelType.TRANSFER]
          .filter(isSortable)
          .filter((file) => file.key !== "from_team")
      : [],
  };

  const injuryOptions = {
    filterableField: ModelType.INJURY
      ? fieldDefinition[ModelType.INJURY]
          .filter(isFilterable)
          .filter((file) => file.key !== "player")
      : [],
    sortField: ModelType.INJURY
      ? fieldDefinition[ModelType.INJURY]
          .filter(isSortable)
          .filter((file) => file.key !== "player")
      : [],
  };

  const matchOptions = {
    filterField: ModelType.MATCH
      ? fieldDefinition[ModelType.MATCH].filter(isFilterable)
      : [],
    sortField: ModelType.MATCH
      ? fieldDefinition[ModelType.MATCH].filter(isSortable)
      : [],
  };

  const inTransfersFormInitialData = useMemo(() => {
    if (!id) return {};
    return { to_team: id };
  }, [id]);

  const outTransfersFormInitialData = useMemo(() => {
    if (!id) return {};
    return { from_team: id };
  }, [id]);

  const injuryFormInitialData = useMemo(() => {
    if (!id) return {};
    return { team: id };
  }, [id]);

  const [selectedteamCompetitionSeason, setSelectedTeamCompetitionSeason] =
    useState<TeamCompetitionSeasonGet | null>(null);

  useEffect(() => {
    const current = teamCompetitionSeason[0];
    setSelectedTeamCompetitionSeason(current);
  }, [teamCompetitionSeason]);

  useEffect(() => {
    if (!selectedteamCompetitionSeason?.season.id) return;
    (async () => {
      readSeason(selectedteamCompetitionSeason?.season.id);
    })();
  }, [selectedteamCompetitionSeason?._id, formIsOpen]);

  useEffect(() => {
    if (!id) return;

    const startDate = season?.start_date
      ? toDateKey(new Date(season?.start_date).toISOString())
      : undefined;

    const endDate = season?.end_date
      ? toDateKey(new Date(season?.end_date).toISOString())
      : undefined;

    // startDate + 2年
    const oneYearLater = season?.start_date
      ? toDateKey(
          new Date(
            new Date(season?.start_date).setFullYear(
              new Date(season?.start_date).getFullYear() + 2
            )
          ).toISOString()
        )
      : undefined;

    // seasonDate を安全に作成
    const seasonDate: string[] = [];
    if (startDate) seasonDate.push(`>=${startDate}`);
    if (endDate) seasonDate.push(`<=${endDate}`);

    if (seasonDate.length === 0) return;

    readPlayers({
      from_date: seasonDate,
      to_team: id,
      sort: "number",
      form: ["!期限付き満了"],
    });
    readFuturePlayers({
      from_date: [`>${endDate}`, `<${oneYearLater}`],
      to_team: id,
      "from_team.age_group": "!full",
      from_team: `exists`,
    });

    readTransfers(
      {
        to_team: id,
        form: "!更新",
        from_date: seasonDate,
      },
      (resBody: ResBody<Transfer>) =>
        setInTransfers(convert(ModelType.TRANSFER, resBody.data)),
      "in"
    );

    readTransfers(
      { from_team: id, from_date: seasonDate },
      (resBody: ResBody<Transfer>) =>
        setOutTransfers(convert(ModelType.TRANSFER, resBody.data)),
      "out"
    );

    readCurrentLoans({
      from_team: id,
      form: ["期限付き", "育成型期限付き"],
      from_date: seasonDate,
    });

    readInjuries({ team: id, doa: seasonDate });

    readMatch({ team: id, date: seasonDate, sort: "date" });
  }, [season]);

  const handleSetSelectedSeason = (id: string | number | Date) => {
    const selected = teamCompetitionSeason.find((s) => s._id === id) ?? null;
    setSelectedTeamCompetitionSeason(selected);
  };

  const seasonOptions: OptionArray = useMemo(
    () =>
      teamCompetitionSeason.map((s) => ({
        key: s._id,
        label: s.season.label,
      })),
    [teamCompetitionSeason]
  );

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
      {selectedTab === "player" && (
        <TableContainer
          items={players}
          headers={[
            { label: "背番号", field: "number", width: "70px" },
            { label: "選手", field: "player" },
            { label: "ポジション", field: "position", width: "70px" },
          ]}
          modelType={ModelType.TRANSFER}
          originalFilterField={inTransfersOptions.filterField}
          originalSortField={inTransfersOptions.sortField}
          formInitialData={inTransfersFormInitialData}
          itemsLoading={playersIsLoading}
          linkField={[
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTab === "future_in" && (
        <TableContainer
          items={futurePlayers}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍元", field: "from_team" },
            { label: "ポジション", field: "position" },
          ]}
          modelType={ModelType.TRANSFER}
          originalFilterField={inTransfersOptions.filterField}
          originalSortField={inTransfersOptions.sortField}
          formInitialData={inTransfersFormInitialData}
          itemsLoading={futurePlayersIsLoading}
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
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTab === "transfer_in" && (
        <TableContainer
          items={inTransfers}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍元", field: "from_team" },
            { label: "形態", field: "form" },
          ]}
          modelType={ModelType.TRANSFER}
          originalFilterField={inTransfersOptions.filterField}
          originalSortField={inTransfersOptions.sortField}
          formInitialData={inTransfersFormInitialData}
          itemsLoading={inTransfersIsLoading}
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
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTab === "transfer_out" && (
        <TableContainer
          items={outTransfers}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          modelType={ModelType.TRANSFER}
          originalFilterField={outTransfersOptions.filterField}
          originalSortField={outTransfersOptions.sortField}
          formInitialData={outTransfersFormInitialData}
          itemsLoading={outTransfersIsLoading}
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
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTab === "loan" && (
        <TableContainer
          items={onLoan}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "選手", field: "player" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          modelType={ModelType.TRANSFER}
          originalFilterField={outTransfersOptions.filterField}
          originalSortField={outTransfersOptions.sortField}
          formInitialData={outTransfersFormInitialData}
          itemsLoading={onLoanIsLoading}
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
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}

      {selectedTab === "injury" && (
        <TableContainer
          items={injuries}
          headers={[
            { label: "発表日", field: "doa" },
            { label: "選手", field: "player" },
            { label: "負傷箇所・診断結果", field: "injured_part" },
            { label: "全治", field: "ttp" },
          ]}
          modelType={ModelType.INJURY}
          originalFilterField={injuryOptions.filterableField}
          originalSortField={injuryOptions.sortField}
          formInitialData={injuryFormInitialData}
          itemsLoading={injuriesIsLoading}
          linkField={[
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
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
          modelType={ModelType.MATCH}
          originalFilterField={matchOptions.filterField}
          originalSortField={matchOptions.sortField}
          itemsLoading={matchIsLoading}
          linkField={[
            { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
            { field: "vsTeam", to: APP_ROUTES.TEAM_SUMMARY },
          ]}
          pageNum={page.page}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Team;
