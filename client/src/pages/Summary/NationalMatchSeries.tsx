import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableWithFetch } from "../../components/table";
import { ModelType } from "../../types/models";
import { NationalMatchSeriesTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { API_PATHS } from ""@dai0413/myorg-shared";
import { useNationalMatchSeries } from "../../context/models/national-match-series";
import { toDateKey } from "../../utils";
import { useForm } from "../../context/form-context";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";

const Tabs = NationalMatchSeriesTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const National = () => {
  const { id } = useParams();
  const { resetFilterConditions } = useFilter();
  const { resetSort } = useSort();
  const { isOpen: formIsOpen } = useForm();

  const [selectedTab, setSelectedTab] = useState("player");

  const [reloadKey, setReloadKey] = useState(0);

  const {
    metacrud: { selected, readItem, isLoading },
  } = useNationalMatchSeries();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
      setReloadKey((prev) => prev + 1);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (value: string | number | Date): void => {
    resetFilterConditions();
    resetSort([]);
    setSelectedTab(value as string);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header情報 */}
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="font-bold text-lg">{selected.name}</div>
            <div className="text-gray-600">{selected.country.label}</div>
            <div className="text-sm text-gray-500">{selected.age_group}</div>
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
      {selectedTab === "player" && id && (
        <TableWithFetch
          modelType={ModelType.NATIONAL_CALLUP}
          headers={[
            { label: "選手", field: "player" },
            { label: "所属チーム", field: "team" },
            { label: "招集状況", field: "status" },
            { label: "背番号", field: "number" },
            { label: "ポジション", field: "position_group" },
          ]}
          fetch={{
            apiRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
            params: { series: id, sort: "position_group_order,number" },
          }}
          filterField={fieldDefinition[ModelType.NATIONAL_CALLUP]
            .filter(isFilterable)
            .filter((file) => file.key !== "series")}
          sortField={fieldDefinition[ModelType.NATIONAL_CALLUP]
            .filter(isSortable)
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
          formInitialData={{
            series: id,
            joined_at: selected?.joined_at
              ? toDateKey(selected?.joined_at)
              : undefined,
            left_at: selected?.left_at
              ? toDateKey(selected?.left_at)
              : undefined,
          }}
          reloadTrigger={reloadKey}
        />
      )}
    </div>
  );
};

export default National;
