import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TableWithFetch } from "../../components/table";
import { usePlayer } from "../../context/models/player";
import { toDateKey } from "../../utils";
import { ModelType } from "../../types/models";
import { PlayerTabItems } from "../../constants/menuItems";
import { IconButton } from "../../components/buttons";
import { SelectField } from "../../components/field";
import { OptionArray } from "../../types/option";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { useForm } from "../../context/form-context";
import { API_ROUTES } from "../../lib/apiRoutes";
import { APP_ROUTES } from "../../lib/appRoutes";

const Tabs = PlayerTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const Player = () => {
  const { id } = useParams();

  const { isOpen: formIsOpen } = useForm();

  const [selectedTab, setSelectedTab] = useState("transfer");

  const {
    metacrud: { selected, readItem, isLoading },
  } = usePlayer();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const formInitialData = useMemo(() => {
    if (!id) return {};
    return { player: id };
  }, [id]);

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
      {selectedTab === "transfer" && id && (
        <TableWithFetch
          modelType={ModelType.TRANSFER}
          headers={[
            { label: "加入日", field: "from_date" },
            { label: "移籍元", field: "from_team" },
            { label: "移籍先", field: "to_team" },
            { label: "形態", field: "form" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.TRANSFER.GET_ALL,
            params: { player: id },
          }}
          filterField={fieldDefinition[ModelType.TRANSFER]
            .filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={fieldDefinition[ModelType.TRANSFER]
            .filter(isSortable)
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
          formInitialData={{
            player: id,
          }}
        />
      )}

      {selectedTab === "injury" && id && (
        <TableWithFetch
          modelType={ModelType.INJURY}
          headers={[
            { label: "発表日", field: "doa" },
            { label: "所属", field: "team" },
            { label: "負傷箇所・診断結果", field: "injured_part" },
            { label: "全治", field: "ttp" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.INJURY.GET_ALL,
            params: { player: id },
          }}
          filterField={fieldDefinition[ModelType.INJURY]
            .filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={fieldDefinition[ModelType.INJURY]
            .filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
          formInitialData={formInitialData}
        />
      )}

      {selectedTab === "nationality" && id && (
        <TableWithFetch
          modelType={ModelType.NATIONAL_CALLUP}
          headers={[
            { label: "代表試合シリーズ", field: "series" },
            { label: "招集状況", field: "status" },
            { label: "背番号", field: "number" },
            { label: "活動開始日", field: "joined_at" },
          ]}
          fetch={{
            apiRoute: API_ROUTES.NATIONAL_CALLUP.GET_ALL,
            params: { player: id },
          }}
          filterField={fieldDefinition[ModelType.NATIONAL_CALLUP]
            .filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={fieldDefinition[ModelType.NATIONAL_CALLUP]
            .filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "series",
              to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
            },
          ]}
          formInitialData={formInitialData}
        />
      )}
    </div>
  );
};

export default Player;
