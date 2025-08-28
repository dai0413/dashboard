import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../components/table";
import { useCountry } from "../../context/models/country-context";
import { ModelType } from "../../types/models";
import { NationalTabItems } from "../../constants/menuItems";
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
import {
  NationalMatchSeries,
  NationalMatchSeriesGet,
} from "../../types/models/national-match-series";
import { readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import {
  NationalCallup,
  NationalCallupGet,
} from "../../types/models/national-callup";
import { APP_ROUTES } from "../../lib/appRoutes";

const Tabs = NationalTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const National = () => {
  const api = useApi();
  const { id } = useParams();

  const [selectedTab, setSelectedTab] = useState("series");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useCountry();

  const [series, setSeries] = useState<NationalMatchSeriesGet[]>([]);
  const [seriesIsLoading, setSeriesIsLoading] = useState<boolean>(false);
  const [callup, setCallup] = useState<NationalCallupGet[]>([]);
  const [callupIsLoading, setCallupIsLoading] = useState<boolean>(false);

  const isLoadingSetters = {
    series: setSeriesIsLoading,
    callup: setCallupIsLoading,
  };

  const setLoading = (
    time: "start" | "end",
    data: keyof typeof isLoadingSetters
  ) => {
    isLoadingSetters[data](time === "start");
  };

  const readSeries = (countryId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_MATCH_SERIES.GET_ALL,
      params: { country: countryId },
      onSuccess: (items: NationalMatchSeries[]) => {
        setSeries(convert(ModelType.NATIONAL_MATCH_SERIES, items));
      },
      handleLoading: (time) => setLoading(time, "series"),
    });

  const readCallup = (countryId: string) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.GET_ALL,
      params: { country: countryId },
      onSuccess: (items: NationalCallup[]) => {
        setCallup(convert(ModelType.NATIONAL_CALLUP, items));
      },
      handleLoading: (time) => setLoading(time, "callup"),
    });

  useEffect(() => {
    if (!id) return;
    (async () => {
      readItem(id);
      readSeries(id);
      readCallup(id);
    })();
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const seriesOptions = {
    filterField: ModelType.NATIONAL_MATCH_SERIES
      ? (fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
          .filter(isFilterable)
          .filter(
            (file) => file.key !== "player"
          ) as FilterableFieldDefinition[])
      : [],
    sortField: ModelType.NATIONAL_MATCH_SERIES
      ? (fieldDefinition[ModelType.NATIONAL_MATCH_SERIES]
          .filter(isSortable)
          .filter((file) => file.key !== "player") as SortableFieldDefinition[])
      : [],
  };

  const callupOptions = {
    filterField: ModelType.NATIONAL_CALLUP
      ? fieldDefinition[ModelType.NATIONAL_CALLUP].filter(isFilterable)
      : [],
    sortField: ModelType.NATIONAL_CALLUP
      ? fieldDefinition[ModelType.NATIONAL_CALLUP].filter(isSortable)
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
            <div className="text-sm text-gray-500">{selected.area}</div>
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
            {NationalTabItems.map(({ icon, text, className }) => {
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
      {selectedTab === "series" && (
        <TableContainer
          items={series}
          headers={[
            { label: "名称", field: "name", width: "250px" },
            { label: "年代", field: "age_group", width: "100px" },
            { label: "招集日", field: "joined_at" },
            { label: "解散日", field: "left_at" },
          ]}
          modelType={ModelType.NATIONAL_MATCH_SERIES}
          originalFilterField={seriesOptions.filterField}
          originalSortField={seriesOptions.sortField}
          formInitialData={{}}
          itemsLoading={seriesIsLoading}
          linkField={[
            {
              field: "name",
              to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
            },
          ]}
        />
      )}

      {selectedTab === "player" && (
        <TableContainer
          items={callup}
          headers={[
            { label: "代表試合シリーズ", field: "series", width: "250px" },
            { label: "選手", field: "player" },
            { label: "招集状況", field: "status", width: "100px" },
            { label: "背番号", field: "number", width: "100px" },
            { label: "ポジション", field: "position_group", width: "100px" },
          ]}
          modelType={ModelType.NATIONAL_CALLUP}
          originalFilterField={callupOptions.filterField}
          originalSortField={callupOptions.sortField}
          formInitialData={{}}
          itemsLoading={callupIsLoading}
          linkField={[
            {
              field: "series",
              to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
            },
            {
              field: "player",
              to: APP_ROUTES.PLAYER_SUMMARY,
            },
          ]}
        />
      )}
    </div>
  );
};

export default National;
