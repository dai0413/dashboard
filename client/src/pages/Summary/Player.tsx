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
import { API_PATHS } from "@dai0413/myorg-shared";
import { APP_ROUTES } from "../../lib/appRoutes";
import { PlayerRegistrationGet } from "../../types/models/player-registration";
import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";

const Tabs = PlayerTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const Player = () => {
  const { id } = useParams();
  const { resetFilterConditions } = useFilter();
  const { resetSort } = useSort();
  const { isOpen: formIsOpen } = useForm();

  const [selectedTab, setSelectedTab] = useState("transfer");

  const [reloadKey, setReloadKey] = useState(0);

  const {
    metacrud: { selected, readItem, isLoading },
  } = usePlayer();

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
            apiRoute: API_PATHS.TRANSFER.ROOT,
            params: { getAll: true, player: id, sort: "-from_date,-_id" },
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
          reloadTrigger={reloadKey}
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
            apiRoute: API_PATHS.INJURY.ROOT,
            params: { getAll: true, player: id },
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
          reloadTrigger={reloadKey}
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
            apiRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
            params: { getAll: true, player: id },
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
          reloadTrigger={reloadKey}
        />
      )}

      {selectedTab === "registration" && id && (
        <TableWithFetch
          modelType={ModelType.PLAYER_REGISTRATION}
          headers={[
            { label: "シーズン", field: "season" },
            { label: "大会", field: "competition" },
            { label: "日付", field: "date" },
            { label: "チーム", field: "team" },
            { label: "登録・抹消", field: "registration_type" },
            { label: "登録・抹消", field: "registration_status" },
            {
              label: "2種・特別指定",
              field: "special_type",
              getData: (data: PlayerRegistrationGet) => {
                if (data.isSpecialDesignation) return "特別指定";
                if (data.isTypeTwo) return "2種";
                return "";
              },
            },
          ]}
          fetch={{
            apiRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
            params: {
              getAll: true,
              player: id,
              sort: "-date,-competition,-registration_type",
            },
          }}
          filterField={fieldDefinition[ModelType.PLAYER_REGISTRATION]
            .filter(isFilterable)
            .filter((file) => file.key !== "player")}
          sortField={fieldDefinition[ModelType.PLAYER_REGISTRATION]
            .filter(isSortable)
            .filter((file) => file.key !== "player")}
          linkField={[
            {
              field: "team",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
            { field: "competition", to: APP_ROUTES.COMPETITION_SUMMARY },
          ]}
          formInitialData={formInitialData}
          reloadTrigger={reloadKey}
        />
      )}
    </div>
  );
};

export default Player;
