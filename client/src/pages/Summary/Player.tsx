import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../components/table";
import { useTransfer } from "../../context/models/transfer-context";
import { useInjury } from "../../context/models/injury-context";
import { usePlayer } from "../../context/models/player-context";
import { toDateKey } from "../../utils";
import { ModelType } from "../../types/models";
import { PlayerTabItems } from "../../constants/menuItems";
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

const Tabs = PlayerTabItems.filter(
  (item) =>
    item.icon && item.text && !item.className?.includes("cursor-not-allowed")
).map((item) => ({
  key: item.icon as string,
  label: item.text as string,
})) as OptionArray;

const Player = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("transfer");

  const { selected, readItem, isLoading } = usePlayer();
  const { readItems: readTransfers } = useTransfer();
  const { readItems: readInjuries } = useInjury();

  useEffect(() => {
    if (!id) return;
    readItem(id);
    readTransfers({ player: id });
    readInjuries({ player: id });
  }, [id]);

  const handleSelectedTab = (value: string | number | Date): void => {
    setSelectedTab(value as string);
  };

  const transferContext = useTransfer();
  const filterableField = ModelType.TRANSFER
    ? (fieldDefinition[ModelType.TRANSFER]
        .filter(isFilterable)
        .filter((file) => file.key !== "player") as FilterableFieldDefinition[])
    : [];
  const sortField = ModelType.TRANSFER
    ? (fieldDefinition[ModelType.TRANSFER]
        .filter(isSortable)
        .filter((file) => file.key !== "player") as SortableFieldDefinition[])
    : [];

  const injuryContext = useInjury();
  const injuryOptions = {
    filterableField: ModelType.INJURY
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

  return isLoading ? (
    <FullScreenLoader />
  ) : (
    <>
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
          <a>読み込み</a>
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
            headers={[
              { label: "加入日", field: "from_date" },
              { label: "移籍元", field: "from_team" },
              { label: "移籍先", field: "to_team" },
              { label: "形態", field: "form" },
            ]}
            modelType={ModelType.TRANSFER}
            contextState={transferContext}
            filterField={filterableField}
            sortField={sortField}
            formInitialData={{ player: id }}
          />
        )}

        {selectedTab === "injury" && (
          <TableContainer
            headers={[
              { label: "発表日", field: "doa" },
              { label: "所属", field: "team" },
              { label: "負傷箇所・診断結果", field: "injured_part" },
              { label: "全治", field: "ttp" },
            ]}
            modelType={ModelType.INJURY}
            contextState={injuryContext}
            filterField={injuryOptions.filterableField}
            sortField={injuryOptions.sortField}
            formInitialData={{ player: id }}
          />
        )}
      </div>
    </>
  );
};

export default Player;
