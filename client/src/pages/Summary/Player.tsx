import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../components/table";
import { usePlayer } from "../../context/models/player-context";
import { toDateKey } from "../../utils";
import { ModelType } from "../../types/models";
import { PlayerTabItems } from "../../constants/menuItems";
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
import { Transfer, TransferGet } from "../../types/models/transfer";
import { Injury, InjuryGet } from "../../types/models/injury";
import { readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { useForm } from "../../context/form-context";
import { useFilter } from "../../context/filter-context";
import {
  NationalCallup,
  NationalCallupGet,
} from "../../types/models/national-callup";
import { useSort } from "../../context/sort-context";

const Tabs = PlayerTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const Player = () => {
  const api = useApi();
  const { id } = useParams();

  const { isOpen: formIsOpen } = useForm();
  const { resetFilterConditions } = useFilter();
  const { resetSort } = useSort();

  const [selectedTab, setSelectedTab] = useState("transfer");

  const { selected, readItem, isLoading } = usePlayer();

  const [transfers, setTransfers] = useState<TransferGet[]>([]);
  const [transferIsLoading, setTransferIsLoading] = useState<boolean>(false);
  const [injuries, setInjuries] = useState<InjuryGet[]>([]);
  const [injuriesIsLoading, setInjuriesIsLoading] = useState<boolean>(false);
  const [callup, setCallup] = useState<NationalCallupGet[]>([]);
  const [callupIsLoading, setCallupIsLoading] = useState<boolean>(false);

  const isLoadingSetters = {
    transfer: setTransferIsLoading,
    injury: setInjuriesIsLoading,
    callup: setCallupIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const readTransfers = (playerId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params: { player: playerId },
      onSuccess: (items: Transfer[]) => {
        setTransfers(convert(ModelType.TRANSFER, items));
      },
      handleLoading: (time) => setLoading(time, "transfer"),
    });

  const readInjuries = (playerId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.GET_ALL,
      params: { player: playerId },
      onSuccess: (items: Injury[]) => {
        setInjuries(convert(ModelType.INJURY, items));
      },
      handleLoading: (time) => setLoading(time, "injury"),
    });

  const readCallup = (playerId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.GET_ALL,
      params: { player: playerId },
      onSuccess: (items: NationalCallup[]) => {
        setCallup(convert(ModelType.NATIONAL_CALLUP, items));
      },
      handleLoading: (time) => setLoading(time, "callup"),
    });

  useEffect(() => {
    if (!id) return;
    resetFilterConditions();
    resetSort([]);
    (async () => {
      await readItem(id);
      await readTransfers(id);
      await readInjuries(id);
      await readCallup(id);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const transferOptions = {
    filterField: ModelType.TRANSFER
      ? (fieldDefinition[ModelType.TRANSFER]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "player"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.TRANSFER
      ? (fieldDefinition[ModelType.TRANSFER]
          .filter(isSortable)
          .filter((file) => file.key !== "player") as SortableFieldDefinition[])
      : [],
  };

  const injuryOptions = {
    filterField: ModelType.INJURY
      ? (fieldDefinition[ModelType.INJURY]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "player"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.INJURY
      ? (fieldDefinition[ModelType.INJURY]
          .filter(isSortable)
          .filter((file) => file.key !== "player") as SortableFieldDefinition[])
      : [],
  };

  const callupOptions = {
    filterField: ModelType.NATIONAL_CALLUP
      ? (fieldDefinition[ModelType.NATIONAL_CALLUP]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "player"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.NATIONAL_CALLUP
      ? (fieldDefinition[ModelType.NATIONAL_CALLUP]
          .filter(isSortable)
          .filter((file) => file.key !== "player") as SortableFieldDefinition[])
      : [],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-bold text-lg">{selected.name}</div>
            <div className="text-gray-600">{selected.en_name}</div>
            <div className="text-sm text-gray-500">
              生年月日：{toDateKey(selected.dob as string | number | Date)}
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
            {PlayerTabItems.map(({ icon, text, className }) => {
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
      {selectedTab === "transfer" && (
        <TableContainer
          items={transfers}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "移籍元", field: "from_team" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          modelType={ModelType.TRANSFER}
          originalFilterField={transferOptions.filterField}
          originalSortField={transferOptions.sortField}
          formInitialData={{ player: id }}
          itemsLoading={transferIsLoading}
        />
      )}

      {selectedTab === "injury" && (
        <TableContainer
          items={injuries}
          headers={[
            { label: "発表日", field: "doa" },
            { label: "所属", field: "team" },
            { label: "負傷箇所・診断結果", field: "injured_part" },
            { label: "全治", field: "ttp" },
          ]}
          modelType={ModelType.INJURY}
          originalFilterField={injuryOptions.filterField}
          originalSortField={injuryOptions.sortField}
          formInitialData={{ player: id }}
          itemsLoading={injuriesIsLoading}
        />
      )}

      {selectedTab === "nationality" && (
        <TableContainer
          items={callup}
          headers={[
            { label: "代表試合シリーズ", field: "series" },
            { label: "招集状況", field: "status" },
            { label: "背番号", field: "number" },
            { label: "活動開始日", field: "joined_at" },
          ]}
          modelType={ModelType.NATIONAL_CALLUP}
          originalFilterField={callupOptions.filterField}
          originalSortField={callupOptions.sortField}
          formInitialData={{ player: id }}
          itemsLoading={callupIsLoading}
        />
      )}
    </div>
  );
};

export default Player;
