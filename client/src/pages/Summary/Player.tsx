import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { CustomTableContainer, TableWithFetch } from "../../components/table";
import { usePlayer } from "../../context/models/player";
import { GettedModelDataMap, ModelType } from "../../types/models";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable, UIFieldDefinition } from "../../types/field";
import { APP_ROUTES } from "../../lib/appRoutes";
import { PlayerRegistrationGet } from "../../types/models/player-registration";
import { useModal } from "../../context/modal-context";
import { ColumnType } from "../../types/table";
import { Formation } from "../../components/formation";
import { FormationItem } from "../../types/formation";
import { readItemsBase } from "../../lib/api";
import { PlayerAppearance } from "../../types/models/player-appearance";
import { api } from "../../context/api-context";
import { convert } from "../../lib/convert/DBtoGetted";
import { positionBase } from "../../components/formation/positionBase";
import { SummaryTabItems } from "../../types/menu/IconButton";
import SummaryTabMenu from "./components/SummaryTabMenu";
import { convertFieldDefinition } from "../../utils/displayField/convertFieldDefinition";

const tabItems: SummaryTabItems[] = [
  {
    icon: "setting",
    key: "position",
    text: "ポジション",
  },
  {
    icon: "transfer",
    key: "transfer",
    text: "移籍",
  },
  {
    icon: "injury",
    key: "injury",
    text: "怪我",
  },
  {
    icon: "nationality",
    key: "national-callup",
    text: "代表歴",
  },
  {
    icon: "registration",
    key: "registration",
    text: "選手登録",
  },
];

const transferFieldDefinition = convertFieldDefinition<ModelType.TRANSFER>(
  ["from_date", "from_team", "to_team", "form"],
  fieldDefinition[ModelType.TRANSFER],
);

const injuryFieldDefinition = convertFieldDefinition<ModelType.INJURY>(
  ["doa", "team", "injured_part", "ttp"],
  fieldDefinition[ModelType.INJURY],
);

const nationalCallupFieldDefinition =
  convertFieldDefinition<ModelType.NATIONAL_CALLUP>(
    ["series", "status", "number", "joined_at"],
    fieldDefinition[ModelType.NATIONAL_CALLUP],
  );

const playerRegistrationFieldDefinition: UIFieldDefinition<
  GettedModelDataMap[ModelType.PLAYER_REGISTRATION]
>[] = [
  ...convertFieldDefinition<ModelType.PLAYER_REGISTRATION>(
    [
      "season",
      "competition",
      "date",
      "team",
      "registration_type",
      "registration_status",
    ],
    fieldDefinition[ModelType.PLAYER_REGISTRATION],
  ),
  {
    label: "2種・特別指定",
    key: "special_type",
    displayOnTable: true,
    getData: (data: PlayerRegistrationGet) => {
      if (data.isSpecialDesignation) return "特別指定";
      if (data.isTypeTwo) return "2種";
      return "";
    },
    getValueType: ColumnType.CUSTOM,
    type: "string",
  },
];

const Player = () => {
  const { id } = useParams();
  const {
    detail: { open },
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("transfer");

  const [positionItems, setPotitionItems] = useState<FormationItem[]>([]);
  const [positionItemsIsLoading, setPositionItemsIsLoading] =
    useState<boolean>(false);

  const fetchData = async (id: string) => {
    setPositionItemsIsLoading(true);

    const obj = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: { getAll: true, player: id },
    });

    if (obj?.data) {
      const converted = convert(ModelType.PLAYER_APPEARANCE, obj.data);
      const withPositions = converted.filter((a) => a.position);
      const total = withPositions.length;

      const stats = new Map<
        string,
        {
          count: number;
          minutes: number;
        }
      >();

      for (const appearance of withPositions) {
        if (!appearance.position) continue;

        const stat = stats.get(appearance.position) ?? {
          count: 0,
          minutes: 0,
        };

        stat.count++;
        stat.minutes += appearance.time ?? 0;

        stats.set(appearance.position, stat);
      }

      const items: FormationItem[] = Array.from(stats.entries()).map(
        ([position, stat]) => {
          const point = positionBase[position as keyof typeof positionBase];

          return {
            position: position as keyof typeof positionBase,

            centerText: stat.count,

            label: position,

            size: 24 + (stat.count / total) * 28,

            color: point.color,

            tooltip: [
              {
                text: position,
                bold: true,
              },
              {
                text: `${stat.count}試合`,
              },
              {
                text: `${stat.minutes}分`,
              },
            ],
          };
        },
      );

      setPotitionItems(items);
    }

    setPositionItemsIsLoading(false);
  };

  const {
    metacrud: { selected, readItem, isLoading },
  } = usePlayer();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
      await fetchData(id);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  const formInitialData = useMemo(() => {
    if (!id) return {};
    return { player: id };
  }, [id]);

  return (
    <div className="p-6">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.PLAYER, selected._id);
              }}
            >
              {selected.name}
            </div>
            <div className="text-gray-600">{selected.en_name}</div>
            <div className="text-sm text-gray-500">
              生年月日：{toDateKey(selected.dob as string | number | Date)}
            </div>
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}

      <SummaryTabMenu
        items={tabItems}
        tab={{ selectedTab: selectedTab, handleSelect: handleSelectedTab }}
      />

      {/* コンテンツ表示 */}
      {selectedTab === "position" && id && (
        <CustomTableContainer
          modelType={ModelType.PLAYER_APPEARANCE}
          fieldDefinitions={[]}
          pageNum={1}
          items={positionItems}
          itemsLoading={positionItemsIsLoading}
          reloadFun={async () => fetchData(id)}
          initialData={{
            formData: {},
            metaData: {},
          }}
          renderView={() => <Formation datas={positionItems} />}
        />
      )}

      {selectedTab === "transfer" && id && (
        <TableWithFetch
          modelType={ModelType.TRANSFER}
          fieldDefinitions={transferFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.TRANSFER.ROOT,
            params: { getAll: true, player: id, sort: "-from_date,-_id" },
          }}
          filterField={transferFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={transferFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "from_team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            {
              field: "to_team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              player: id,
            },
          }}
        />
      )}

      {selectedTab === "injury" && id && (
        <TableWithFetch
          modelType={ModelType.INJURY}
          fieldDefinitions={injuryFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.INJURY.ROOT,
            params: { getAll: true, player: id },
          }}
          filterField={injuryFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={injuryFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          initialData={{ formData: formInitialData }}
        />
      )}

      {selectedTab === "national-callup" && id && (
        <TableWithFetch
          modelType={ModelType.NATIONAL_CALLUP}
          fieldDefinitions={nationalCallupFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
            params: { getAll: true, player: id },
          }}
          filterField={nationalCallupFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={nationalCallupFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "series",
              to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
            },
          ]}
          initialData={{ formData: formInitialData }}
        />
      )}

      {selectedTab === "registration" && id && (
        <TableWithFetch
          modelType={ModelType.PLAYER_REGISTRATION}
          fieldDefinitions={playerRegistrationFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
            params: {
              getAll: true,
              player: id,
              sort: "-date,-competition,-registration_type",
            },
          }}
          filterField={playerRegistrationFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={playerRegistrationFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
          ]}
          initialData={{ formData: formInitialData }}
        />
      )}
    </div>
  );
};

export default Player;
