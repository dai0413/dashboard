import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { TableWithFetch } from "../../components/table";
import { ModelType } from "../../types/models";
import { NationalMatchSeriesTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/form/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { useNationalMatchSeries } from "../../context/models/national-match-series";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { ColumnType } from "../../types/table";
import { MatchGet } from "../../types/models/match";

const Tabs = NationalMatchSeriesTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed"),
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const National = () => {
  const { id } = useParams();
  const {
    detail: { open },
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("player");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useNationalMatchSeries();

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

  const matchs = useMemo(() => {
    return (
      selected?.matches
        ?.map((d) => d.id)
        .filter((d): d is string => typeof d === "string") ?? []
    );
  }, [selected]);

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.NATIONAL_MATCH_SERIES, selected._id);
              }}
            >
              {selected.name}
            </div>
            <div className="text-gray-600">{selected.country.label}</div>
            <div className="text-sm text-gray-500">{selected.age_group}</div>
            <div className="text-gray-600">{selected.team.label}</div>
            <div className="text-sm text-gray-500">
              {`${selected.joined_at && toDateKey(selected.joined_at)}~~~${
                selected.left_at && toDateKey(selected.left_at)
              }`}
            </div>
            <div className="text-sm text-gray-500">
              {selected.urls.map((url, index) => {
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    link-{index + 1}
                  </a>
                );
              })}
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
            {NationalMatchSeriesTabItems.map(({ icon, text, className }) => {
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
      {selectedTab === "match" && (
        <TableWithFetch
          modelType={ModelType.MATCH}
          fieldDefinitions={[
            {
              label: "大会",
              field: "competition",
              getValueType: ColumnType.FIELD,
              key: "competition",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "開催日",
              getData: (d: MatchGet) => toDateKey(d.date, true) || "",
              getValueType: ColumnType.CUSTOM,
              key: "date",
              displayOnTable: true,
              type: "datetime-local",
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
              label: "ステージ",
              field: "competition_stage",
              width: "100px",
              getValueType: ColumnType.FIELD,
              key: "competition_stage",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "ホーム",
              field: "home_team",
              getValueType: ColumnType.FIELD,
              key: "home_team",
              displayOnTable: true,
              type: "string",
            },
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
            {
              label: "アウェイ",
              field: "away_team",
              getValueType: ColumnType.FIELD,
              key: "away_team",
              displayOnTable: true,
              type: "string",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.MATCH.ROOT,
            params: {
              getAll: true,
              _id: matchs,
              sort: "date",
            },
          }}
          filterField={fieldDefinition[ModelType.MATCH]?.filter(isFilterable)}
          sortField={fieldDefinition[ModelType.MATCH]?.filter(isSortable)}
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
            {
              field: "competition",
              to: APP_ROUTES.COMPETITION_SUMMARY,
            },
          ]}
          initialData={{}}
        />
      )}

      {selectedTab === "player" && id && (
        <TableWithFetch
          modelType={ModelType.NATIONAL_CALLUP}
          fieldDefinitions={[
            {
              label: "選手",
              field: "player",
              getValueType: ColumnType.FIELD,
              key: "player",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "所属チーム",
              field: "team",
              getValueType: ColumnType.FIELD,
              key: "team",
              displayOnTable: true,
              type: "string",
            },
            {
              label: "招集状況",
              field: "status",
              getValueType: ColumnType.FIELD,
              key: "status",
              displayOnTable: true,
              type: "select",
            },
            {
              label: "背番号",
              field: "number",
              getValueType: ColumnType.FIELD,
              key: "number",
              displayOnTable: true,
              type: "number",
            },
            {
              label: "ポジション",
              field: "position_group",
              getValueType: ColumnType.FIELD,
              key: "position_group",
              displayOnTable: true,
              type: "select",
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
            params: {
              getAll: true,
              series: id,
              sort: "position_group_order,number",
            },
          }}
          filterField={fieldDefinition[ModelType.NATIONAL_CALLUP]
            ?.filter(isFilterable)
            .filter((file) => file.key !== "series")}
          sortField={fieldDefinition[ModelType.NATIONAL_CALLUP]
            ?.filter(isSortable)
            .filter((file) => file.key !== "series")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              series: id,
              joined_at: selected?.joined_at
                ? toDateKey(selected?.joined_at)
                : undefined,
              left_at: selected?.left_at
                ? toDateKey(selected?.left_at)
                : undefined,
            },
            metaData: {
              series: id,
            },
          }}
        />
      )}
    </div>
  );
};

export default National;
