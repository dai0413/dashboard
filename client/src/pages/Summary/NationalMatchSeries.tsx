import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { TableWithFetch } from "../../components/table";
import { GettedModelDataMap, ModelType } from "../../types/models";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable, UIFieldDefinition } from "../../types/field";
import { useNationalMatchSeries } from "../../context/models/national-match-series";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { ColumnType } from "../../types/table";
import { MatchGet } from "../../types/models/match";
import { SummaryTabItems } from "../../types/menu/IconButton";
import SummaryTabMenu from "./components/SummaryTabMenu";
import { convertFieldDefinition } from "../../utils/displayField/convertFieldDefinition";

const tabItems: SummaryTabItems[] = [
  {
    icon: "match",
    key: "match",
    text: "試合",
  },
  {
    icon: "player",
    key: "player",
    text: "招集選手",
  },
];

const matchFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.MATCH]
>[] = [
  ...convertFieldDefinition<ModelType.MATCH>(
    [
      "competition",
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

const nationalCallupFieldDefinition =
  convertFieldDefinition<ModelType.NATIONAL_CALLUP>(
    ["player", "team", "status", "number", "position_group"],
    fieldDefinition[ModelType.NATIONAL_CALLUP],
  );

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

      <SummaryTabMenu
        items={tabItems}
        selectedTab={selectedTab}
        onChange={handleSelectedTab}
      />

      {/* コンテンツ表示 */}
      {selectedTab === "match" && (
        <TableWithFetch
          modelType={ModelType.MATCH}
          fieldDefinitions={matchFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.MATCH.ROOT,
            params: {
              getAll: true,
              _id: matchs,
              sort: "date",
            },
          }}
          filterField={matchFieldDefinition?.filter(isFilterable)}
          sortField={matchFieldDefinition?.filter(isSortable)}
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
          fieldDefinitions={nationalCallupFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
            params: {
              getAll: true,
              series: id,
              sort: "position_group_order,number",
            },
          }}
          filterField={nationalCallupFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "series")}
          sortField={nationalCallupFieldDefinition
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
