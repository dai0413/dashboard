import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { CustomTableContainer, TableWithFetch } from "../../components/table";
import { useMatch } from "../../context/models/match";
import { ModelType } from "../../types/models";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { ColumnType } from "../../types/table";
import { PlayerAppearance } from "../../types/models/player-appearance";
import { api } from "../../context/api-context";
import { readItemsBase } from "../../lib/api";
import { convert } from "../../lib/convert/DBtoGetted";
import { Formation } from "../../components/formation";
import { FormationItem } from "../../types/formation";
import { positionBase } from "../../components/formation/positionBase";
import { createTabsOptionArray } from "../../utils/tab/createTabsOptionArray";
import { SummaryTabItems } from "../../types/menu/IconButton";

const MatchTabItems: SummaryTabItems[] = [
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

const Tabs = createTabsOptionArray(MatchTabItems);

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
            {MatchTabItems.map(({ key, icon, text }) => {
              const tabKey = key ? key : icon;
              const isActive = selectedTab === tabKey;
              return (
                <li key={text}>
                  <IconButton
                    key={key}
                    icon={icon}
                    text={text}
                    color={isActive ? "green" : "gray"}
                    onClick={() => handleSelectedTab(tabKey)}
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
          fieldDefinitions={[
            {
              label: "背番号",
              field: "number",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "number",
              displayOnTable: true,
              type: "number",
            },
            {
              label: "ステータス",
              field: "play_status",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "play_status",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "選手",
              field: "player",
              getValueType: ColumnType.FIELD,
              key: "player",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "時間",
              field: "time",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "time",
              displayOnTable: true,
              type: "number",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
            params: {
              getAll: true,
              match: id,
              team: selected.home_team.id,
              play_status: "!start",
            },
          }}
          filterField={fieldDefinition[ModelType.PLAYER_APPEARANCE]
            ?.filter(isFilterable)
            .filter((file) => file.key !== "match" && file.key !== "team")}
          sortField={fieldDefinition[ModelType.PLAYER_APPEARANCE]
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
          fieldDefinitions={[
            {
              label: "背番号",
              field: "number",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "number",
              displayOnTable: true,
              type: "number",
            },
            {
              label: "ステータス",
              field: "play_status",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "play_status",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "選手",
              field: "player",
              getValueType: ColumnType.FIELD,
              key: "player",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "時間",
              field: "time",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "time",
              displayOnTable: true,
              type: "number",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
            params: {
              getAll: true,
              match: id,
              team: selected.away_team.id,
              play_status: "!start",
            },
          }}
          filterField={fieldDefinition[ModelType.PLAYER_APPEARANCE]
            ?.filter(isFilterable)
            .filter((file) => file.key !== "match" && file.key !== "team")}
          sortField={fieldDefinition[ModelType.PLAYER_APPEARANCE]
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
            fieldDefinitions={[
              {
                label: "チーム",
                field: "team",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "スタッフ",
                field: "staff",
                getValueType: ColumnType.FIELD,
                key: "staff",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "役割",
                field: "role",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "role",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.STAFF_APPEARANCE.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
                sort: "time",
              },
            }}
            filterField={fieldDefinition[ModelType.STAFF_APPEARANCE]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={fieldDefinition[ModelType.STAFF_APPEARANCE]
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
            fieldDefinitions={[
              {
                label: "前後半",
                field: "period_label",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "period_label",
                displayOnTable: true,
                type: "select",
              },
              {
                label: "時間",
                field: "time_name",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "time_name",
                displayOnTable: true,
                type: "number",
              },
              {
                label: "特別時間",
                field: "special_time",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "special_time",
                displayOnTable: true,
                type: "select",
              },
              {
                label: "チーム",
                field: "team",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "イベント",
                field: "match_event_type",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "match_event_type",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "選手",
                field: "player",
                getValueType: ColumnType.FIELD,
                key: "player",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.PLAYER_MATCH_EVENT_LOG.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
                sort: "time",
              },
            }}
            filterField={fieldDefinition[ModelType.PLAYER_MATCH_EVENT_LOG]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={fieldDefinition[ModelType.PLAYER_MATCH_EVENT_LOG]
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
            fieldDefinitions={[
              {
                label: "前後半",
                field: "period_label",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "period_label",
                displayOnTable: true,
                type: "select",
              },
              {
                label: "時間",
                field: "time_name",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "time_name",
                displayOnTable: true,
                type: "number",
              },
              {
                label: "特別時間",
                field: "special_time",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "special_time",
                displayOnTable: true,
                type: "select",
              },
              {
                label: "チーム",
                field: "team",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "イベント",
                field: "match_event_type",
                width: "100px",
                getValueType: ColumnType.FIELD,
                key: "match_event_type",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "スタッフ",
                field: "staff",
                getValueType: ColumnType.FIELD,
                key: "staff",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.STAFF_MATCH_EVENT_LOG.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
                sort: "time",
              },
            }}
            filterField={fieldDefinition[ModelType.STAFF_MATCH_EVENT_LOG]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={fieldDefinition[ModelType.STAFF_MATCH_EVENT_LOG]
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
            fieldDefinitions={[
              {
                label: "チーム",
                field: "team",
                getValueType: ColumnType.FIELD,
                key: "team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "フォーメーション",
                field: "formation",
                getValueType: ColumnType.FIELD,
                key: "formation",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id, selected.away_team.id],
              },
            }}
            filterField={fieldDefinition[ModelType.TEAM_MATCH_FORMATION]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={fieldDefinition[ModelType.TEAM_MATCH_FORMATION]
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
            fieldDefinitions={[
              {
                label: "チーム",
                field: "team",
                getValueType: ColumnType.FIELD,
                key: "team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "シュート",
                field: "shootFor",
                getValueType: ColumnType.FIELD,
                key: "shootFor",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.STATS_L.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.home_team.id],
              },
            }}
            filterField={fieldDefinition[ModelType.STATS_L]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match" && file.key !== "team")}
            sortField={fieldDefinition[ModelType.STATS_L]
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
            fieldDefinitions={[
              {
                label: "チーム",
                field: "team",
                getValueType: ColumnType.FIELD,
                key: "team",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "シュート",
                field: "shootFor",
                getValueType: ColumnType.FIELD,
                key: "shootFor",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.STATS_L.ROOT,
              params: {
                getAll: true,
                match: id,
                team: [selected.away_team.id],
              },
            }}
            filterField={fieldDefinition[ModelType.STATS_L]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match" && file.key !== "team")}
            sortField={fieldDefinition[ModelType.STATS_L]
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
            fieldDefinitions={[
              {
                label: "審判",
                field: "referee",
                getValueType: ColumnType.FIELD,
                key: "referee",
                displayOnTable: true,
                type: "string",
              },
              {
                label: "役割",
                field: "role",
                getValueType: ColumnType.FIELD,
                key: "role",
                displayOnTable: true,
                type: "string",
              },
            ]}
            fetch={{
              apiRoute: API_PATHS.REFEREE_APPEARANCE.ROOT,
              params: {
                getAll: true,
                match: id,
              },
            }}
            filterField={fieldDefinition[ModelType.REFEREE_APPEARANCE]
              ?.filter(isFilterable)
              .filter((file) => file.key !== "match")}
            sortField={fieldDefinition[ModelType.REFEREE_APPEARANCE]
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
