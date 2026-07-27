import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { CustomTableContainer, TableWithFetch } from "../../components/table";
import { useMatch } from "../../context/models/match";
import { ModelType } from "../../types/models";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { PlayerAppearance } from "../../types/models/player-appearance";
import { api } from "../../context/api-context";
import { readItemsBase } from "../../lib/api";
import { convert } from "../../lib/convert/DBtoGetted";
import { Formation } from "../../components/formation";
import { FormationItem } from "../../types/formation";
import { positionBase } from "../../components/formation/positionBase";
import { SummaryTabItems } from "../../types/menu/IconButton";
import SummaryTabMenu from "./components/SummaryTabMenu";
import { convertFieldDefinition } from "../../utils/displayField/convertFieldDefinition";

const tabItems: SummaryTabItems[] = [
  {
    icon: "team",
    key: "home_player",
    text: "ホームスタメン",
  },
  {
    icon: "team",
    key: "home_sub",
    text: "ホームサブ",
  },
  {
    icon: "away",
    key: "away_player",
    text: "アウェイスタメン",
  },
  {
    icon: "away",
    key: "away_sub",
    text: "アウェイサブ",
  },
  {
    icon: "team",
    key: "staff",
    text: "スタッフ",
  },
  {
    icon: "player",
    key: "player_event_log",
    text: "選手イベント",
  },
  {
    icon: "staff",
    key: "staff_event_log",
    text: "監督イベント",
  },
  {
    icon: "setting",
    key: "formation",
    text: "フォーメーション",
  },
  {
    icon: "setting",
    key: "home-stats-l",
    text: "ホームスタッツ",
  },
  {
    icon: "setting",
    key: "away-stats-l",
    text: "アウェイスタッツ",
  },
  {
    icon: "player",
    key: "referee",
    text: "審判",
  },
];

const playerAppearanceFieldDefinition =
  convertFieldDefinition<ModelType.PLAYER_APPEARANCE>(
    ["number", "play_status", "player", "time"],
    fieldDefinition[ModelType.PLAYER_APPEARANCE],
  );

const staffAppearanceFieldDefinition =
  convertFieldDefinition<ModelType.STAFF_APPEARANCE>(
    ["team", "staff", "role"],
    fieldDefinition[ModelType.STAFF_APPEARANCE],
  );

const playerEventLogFieldDefinition =
  convertFieldDefinition<ModelType.PLAYER_MATCH_EVENT_LOG>(
    [
      "period_label",
      "time_name",
      "special_time",
      "team",
      "match_event_type",
      "player",
    ],
    fieldDefinition[ModelType.PLAYER_MATCH_EVENT_LOG],
  );

const staffEventLogFieldDefinition =
  convertFieldDefinition<ModelType.STAFF_MATCH_EVENT_LOG>(
    [
      "period_label",
      "time_name",
      "special_time",
      "team",
      "match_event_type",
      "staff",
    ],
    fieldDefinition[ModelType.STAFF_MATCH_EVENT_LOG],
  );

const teamMatchFormationFieldDefinition =
  convertFieldDefinition<ModelType.TEAM_MATCH_FORMATION>(
    ["team", "formation"],
    fieldDefinition[ModelType.TEAM_MATCH_FORMATION],
  );

const statsLFieldDefinition = convertFieldDefinition<ModelType.STATS_L>(
  ["team", "xgFor", "xgAgainst"],
  fieldDefinition[ModelType.STATS_L],
);

const refereeAppearanceFieldDefinition =
  convertFieldDefinition<ModelType.REFEREE_APPEARANCE>(
    ["referee", "role"],
    fieldDefinition[ModelType.REFEREE_APPEARANCE],
  );

const Match = () => {
  const { id } = useParams();
  const {
    detail: { open },
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("home_player");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useMatch();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  const [homePlayers, setHomePlayers] = useState<FormationItem[]>([]);
  const [homeIsLoading, setHomeIsLoading] = useState<boolean>(false);
  const [awayPlayers, setAwayPlayers] = useState<FormationItem[]>([]);
  const [awayIsLoading, setAwayIsLoading] = useState<boolean>(false);

  const fetchData = async (
    setIsLoading: (val: boolean) => void,
    setData: (data: FormationItem[]) => void,
    teamId?: string,
  ) => {
    setIsLoading(true);
    if (!id || !teamId) return setIsLoading(false);
    const readParams: Record<string, any> = {
      getAll: true,
      match: id,
      team: teamId,
    };

    const obj = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: readParams,
    });

    if (obj?.data) {
      const converted = convert(ModelType.PLAYER_APPEARANCE, obj.data);

      const items: FormationItem[] = converted.map((p) => ({
        position: p.position as keyof typeof positionBase,
        centerText: p.number,
        label: p.player?.label,
        link: p.player.id
          ? `${APP_ROUTES.PLAYER_SUMMARY}/${p.player.id}`
          : undefined,
        tooltip: [
          { text: p.player?.label ?? "", bold: true },
          { text: `背番号 ${p.number}` },
        ],
      }));

      setData(items);
    }

    setIsLoading(false);
  };

  const readPlayers = async () => {
    fetchData(setHomeIsLoading, setHomePlayers, selected?.home_team.id);
    fetchData(setAwayIsLoading, setAwayPlayers, selected?.away_team.id);
  };

  useEffect(() => {
    readPlayers();
  }, [selected?.home_team.id, selected?.away_team.id]);

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.MATCH, selected._id);
              }}
            >
              {`${selected.home_team.label}-${selected.away_team.label}`}
            </div>
            <div className="text-gray-600">{selected.competition.label}</div>
            {selected.competition_stage && (
              <div className="text-gray-600">
                {selected.competition_stage.label}
              </div>
            )}
            {selected.match_week && (
              <div className="text-gray-600">{`第${selected.match_week}節`}</div>
            )}
            <div className="text-sm text-gray-500">
              開催日：{toDateKey(selected.date)}
            </div>
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
      {selectedTab === "home_player" && id && selected?.home_team.id && (
        <CustomTableContainer
          modelType={ModelType.PLAYER_APPEARANCE}
          fieldDefinitions={[]}
          pageNum={1}
          items={homePlayers}
          itemsLoading={homeIsLoading}
          reloadFun={async () =>
            fetchData(setHomeIsLoading, setHomePlayers, selected?.home_team.id)
          }
          initialData={{
            formData: {
              match: id,
              team: selected?.home_team.id,
            },
            metaData: {
              match: [id],
              urls: selected.urls,
              date: selected.date,
              season: selected.season.id,
              competition_stage: selected.competition_stage.id,
            },
          }}
          renderView={() => <Formation datas={homePlayers} />}
        />
      )}

      {selectedTab === "home_sub" && id && selected?.home_team.id && (
        <TableWithFetch
          modelType={ModelType.PLAYER_APPEARANCE}
          fieldDefinitions={playerAppearanceFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
            params: {
              getAll: true,
              match: id,
              team: selected.home_team.id,
              play_status: "!start",
            },
          }}
          filterField={playerAppearanceFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "match" && file.key !== "team")}
          sortField={playerAppearanceFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "match" && file.key !== "team")}
          linkField={[
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              match: id,
              team: selected?.home_team.id,
            },
            metaData: {
              match: [id],
              urls: selected.urls,
              date: selected.date,
              season: selected.season.id,
              competition_stage: selected.competition_stage.id,
            },
          }}
        />
      )}

      {selectedTab === "away_player" && id && selected?.away_team.id && (
        <CustomTableContainer
          modelType={ModelType.PLAYER_APPEARANCE}
          fieldDefinitions={[]}
          pageNum={1}
          items={awayPlayers}
          itemsLoading={awayIsLoading}
          reloadFun={async () =>
            fetchData(setAwayIsLoading, setAwayPlayers, selected?.away_team.id)
          }
          initialData={{
            formData: {
              match: id,
              team: selected?.away_team.id,
            },
            metaData: {
              match: [id],
              urls: selected.urls,
              date: selected.date,
              season: selected.season.id,
              competition_stage: selected.competition_stage.id,
            },
          }}
          renderView={() => <Formation datas={awayPlayers} />}
        />
      )}

      {selectedTab === "away_sub" && id && selected?.away_team.id && (
        <TableWithFetch
          modelType={ModelType.PLAYER_APPEARANCE}
          fieldDefinitions={playerAppearanceFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
            params: {
              getAll: true,
              match: id,
              team: selected.away_team.id,
              play_status: "!start",
            },
          }}
          filterField={playerAppearanceFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "match" && file.key !== "team")}
          sortField={playerAppearanceFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "match" && file.key !== "team")}
          linkField={[
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              match: id,
              team: selected?.away_team.id,
            },
            metaData: {
              match: [id],
              urls: selected.urls,
              date: selected.date,
              season: selected.season.id,
              competition_stage: selected.competition_stage.id,
            },
          }}
        />
      )}

      {selectedTab === "staff" &&
        id &&
        selected?.home_team.id &&
        selected?.away_team.id && (
          <TableWithFetch
            modelType={ModelType.STAFF_APPEARANCE}
            fieldDefinitions={staffAppearanceFieldDefinition}
            fetch={{
              apiRoute: API_PATHS.STAFF_APPEARANCE.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
                sort: "time",
              },
            }}
            filterField={staffAppearanceFieldDefinition
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={staffAppearanceFieldDefinition
              ?.filter(isSortable)
              .filter((file) => file.key !== "match")}
            linkField={[
              {
                field: "staff",
                to: APP_ROUTES.STAFF_SUMMARY,
              },
            ]}
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
                urls: selected.urls,
                date: selected.date,
                season: selected.season.id,
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}

      {selectedTab === "player_event_log" &&
        id &&
        selected?.home_team.id &&
        selected?.away_team.id && (
          <TableWithFetch
            modelType={ModelType.PLAYER_MATCH_EVENT_LOG}
            fieldDefinitions={playerEventLogFieldDefinition}
            fetch={{
              apiRoute: API_PATHS.PLAYER_MATCH_EVENT_LOG.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
                sort: "time",
              },
            }}
            filterField={playerEventLogFieldDefinition
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={playerEventLogFieldDefinition
              ?.filter(isSortable)
              .filter((file) => file.key !== "match")}
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
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
                urls: selected.urls,
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}

      {selectedTab === "staff_event_log" &&
        id &&
        selected?.home_team.id &&
        selected?.away_team.id && (
          <TableWithFetch
            modelType={ModelType.STAFF_MATCH_EVENT_LOG}
            fieldDefinitions={staffEventLogFieldDefinition}
            fetch={{
              apiRoute: API_PATHS.STAFF_MATCH_EVENT_LOG.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
                sort: "time",
              },
            }}
            filterField={staffEventLogFieldDefinition
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={staffEventLogFieldDefinition
              ?.filter(isSortable)
              .filter((file) => file.key !== "match")}
            linkField={[
              {
                field: "staff",
                to: APP_ROUTES.STAFF_SUMMARY,
              },
            ]}
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
                urls: selected.urls,
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}

      {selectedTab === "formation" &&
        id &&
        selected?.home_team.id &&
        selected?.away_team.id && (
          <TableWithFetch
            modelType={ModelType.TEAM_MATCH_FORMATION}
            fieldDefinitions={teamMatchFormationFieldDefinition}
            fetch={{
              apiRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
              },
            }}
            filterField={teamMatchFormationFieldDefinition
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={teamMatchFormationFieldDefinition
              ?.filter(isSortable)
              .filter((file) => file.key !== "match")}
            linkField={[
              {
                field: "team",
                to: APP_ROUTES.TEAM_SUMMARY,
              },
            ]}
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
                urls: selected.urls,
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}

      {selectedTab === "home-stats-l" &&
        id &&
        selected?.home_team.id &&
        selected?.away_team.id && (
          <TableWithFetch
            modelType={ModelType.STATS_L}
            fieldDefinitions={statsLFieldDefinition}
            fetch={{
              apiRoute: API_PATHS.STATS_L.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id],
              },
            }}
            filterField={statsLFieldDefinition
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match" && file.key !== "team")}
            sortField={statsLFieldDefinition
              ?.filter(isSortable)
              .filter((file) => file.key !== "match" && file.key !== "team")}
            linkField={[
              {
                field: "team",
                to: APP_ROUTES.TEAM_SUMMARY,
              },
            ]}
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
                urls: selected.urls,
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}

      {selectedTab === "away-stats-l" &&
        id &&
        selected?.away_team.id &&
        selected?.away_team.id && (
          <TableWithFetch
            modelType={ModelType.STATS_L}
            fieldDefinitions={statsLFieldDefinition}
            fetch={{
              apiRoute: API_PATHS.STATS_L.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.away_team.id],
              },
            }}
            filterField={statsLFieldDefinition
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match" && file.key !== "team")}
            sortField={statsLFieldDefinition
              ?.filter(isSortable)
              .filter((file) => file.key !== "match" && file.key !== "team")}
            linkField={[
              {
                field: "team",
                to: APP_ROUTES.TEAM_SUMMARY,
              },
            ]}
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
                urls: selected.urls,
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}

      {selectedTab === "referee" &&
        id &&
        selected?.home_team.id &&
        selected?.away_team.id && (
          <TableWithFetch
            modelType={ModelType.REFEREE_APPEARANCE}
            fieldDefinitions={refereeAppearanceFieldDefinition}
            fetch={{
              apiRoute: API_PATHS.REFEREE_APPEARANCE.ROOT,
              params: {
                getAll: true,
                match: id,
              },
            }}
            filterField={refereeAppearanceFieldDefinition
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={refereeAppearanceFieldDefinition
              ?.filter(isSortable)
              .filter((file) => file.key !== "match")}
            linkField={[
              {
                field: "referee",
                to: APP_ROUTES.REFEREE_SUMMARY,
              },
            ]}
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
                urls: selected.urls,
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}
    </div>
  );
};

export default Match;
