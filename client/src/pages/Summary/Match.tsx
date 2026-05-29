import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { TableWithFetch } from "../../components/table";
import { useMatch } from "../../context/models/match";
import { ModelType } from "../../types/models";
import { MatchTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { ColumnType } from "../../types/table";

const Tabs = MatchTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed"),
).map((item) => ({
  key: item.key ? item.key : item.icon || "",
  label: item.text || "",
}));

const Match = () => {
  const { id } = useParams();
  const {
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("");

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

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-bold text-lg">{`${selected.home_team.label}-${selected.away_team.label}`}</div>
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
            {MatchTabItems.map(({ key, icon, text, className }) => {
              const tabKey = key ? key : icon;
              const isActive = selectedTab === tabKey;
              return (
                <li key={text}>
                  <IconButton
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
      {selectedTab === "home" && id && selected?.home_team.id && (
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
              type: "string",
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
              label: "ポジション",
              field: "position",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "position",
              displayOnTable: true,
              type: "select",
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
            params: { getAll: true, match: id, team: selected.home_team.id },
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
              competition_stage: selected.competition_stage.id,
            },
          }}
        />
      )}

      {selectedTab === "away" && id && selected?.away_team.id && (
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
              label: "ポジション",
              field: "position",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "position",
              displayOnTable: true,
              type: "select",
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
            params: { getAll: true, match: id, team: selected.away_team.id },
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
            linkField={
              [
                // {
                //   field: "staff",
                //   to: APP_ROUTES.STAFF_SUMMARY,
                // },
              ]
            }
            initialData={{
              formData: {
                match: id,
              },
              metaData: {
                match: [id],
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
                competition_stage: selected.competition_stage.id,
              },
            }}
          />
        )}
    </div>
  );
};

export default Match;
