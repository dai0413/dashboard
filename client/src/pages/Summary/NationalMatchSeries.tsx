import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../components/table";
import { ModelType } from "../../types/models";
import { NationalMatchSeriesTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../context/options-provider";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../../types/field";
import { readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import {
  NationalCallup,
  NationalCallupGet,
} from "../../types/models/national-callup";
import { useNationalMatchSeries } from "../../context/models/national-match-series-context";
import { toDateKey } from "../../utils";
import { useFilter } from "../../context/filter-context";

const Tabs = NationalMatchSeriesTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const National = () => {
  const api = useApi();
  const { id } = useParams();
  const { resetFilterConditions } = useFilter();
  useEffect(() => resetFilterConditions(), []);

  const [selectedTab, setSelectedTab] = useState("player");

  const { selected, readItem, isLoading } = useNationalMatchSeries();

  const [callup, setCallup] = useState<NationalCallupGet[]>([]);
  const [callupIsLoading, setCallupIsLoading] = useState<boolean>(false);

  const isLoadingSetters = {
    callup: setCallupIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const readCallup = (seriesId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.GET_ALL,
      params: { series: seriesId },
      onSuccess: (items: NationalCallup[]) => {
        setCallup(convert(ModelType.NATIONAL_CALLUP, items));
      },
      handleLoading: (time) => setLoading(time, "callup"),
    });

  useEffect(() => {
    if (!id) return;
    readItem(id);
    readCallup(id);
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const callupOptions = {
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-bold text-lg">{selected.name}</div>
            <div className="text-gray-600">{selected.country.label}</div>
            <div className="text-sm text-gray-500">{selected.team_class}</div>
            <div className="text-sm text-gray-500">
              {`${selected.joined_at && toDateKey(selected.joined_at)}~~~${
                selected.left_at && toDateKey(selected.left_at)
              }`}
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
      {selectedTab === "player" && (
        <TableContainer
          items={callup}
          headers={[
            { label: "選手", field: "player" },
            { label: "所属チーム", field: "team" },
            { label: "招集状況", field: "status" },
            { label: "背番号", field: "number" },
            { label: "ポジション", field: "position" },
          ]}
          modelType={ModelType.NATIONAL_CALLUP}
          originalFilterField={callupOptions.filterField}
          originalSortField={callupOptions.sortField}
          formInitialData={{ series: id }}
          itemsLoading={callupIsLoading}
        />
      )}
    </div>
  );
};

export default National;
