import { LinkButtonGroup } from "../buttons/index";
import { useFilter } from "../../context/filter-context";
import { Modal } from "../ui";
import { FilterableField, FilterCondition } from "../../types/types";
import { useState } from "react";
import { useOptions } from "../../context/options-provider";
import { InputField, SelectField } from "../field";

type FilterProps = {
  filterableField: FilterableField[];
};

const defaultFilterCondition: FilterCondition = {
  key: "",
  label: "",
  type: "string",
  value: "",
  operator: "equals",
};

const Filter = ({ filterableField }: FilterProps) => {
  const {
    filterOpen,
    backFilter,
    searchValue,
    filterConditions,
    handleAddCondition,
    handleEdit,
    handleDelete,
    closeFilter,
  } = useFilter();

  const { getOptions } = useOptions();

  const [isAdding, setIsAdding] = useState(false);
  const [filterCondition, setFilterCondition] = useState<FilterCondition>(
    defaultFilterCondition
  );

  const resetFilterCondition = () => setFilterCondition(defaultFilterCondition);

  const handleFieldSelect = (field: FilterableField) =>
    setFilterCondition({
      key: field.key,
      label: field.label,
      type: field.type,
      value: "",
      operator: "equals",
    });

  const handleFieldValue = (value: string | number | Date) =>
    setFilterCondition((prev) => ({
      ...prev,
      value: value,
    }));

  return (
    <Modal isOpen={filterOpen} onClose={closeFilter}>
      <div className="mb-4 space-y-2">
        <label className="block text-gray-700 font-semibold">現在の条件</label>
        {filterConditions.length === 0 && (
          <p className="text-gray-400">条件なし</p>
        )}

        {filterConditions.map((cond, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
          >
            <span>
              {cond.label} : {String(cond.value)}
            </span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(index)}>編集</button>
              <button onClick={() => handleDelete(index)}>削除</button>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">項目を選択</label>
            <select
              value={filterCondition.key}
              onChange={(e) => {
                const field = filterableField.find(
                  (f) => f.key === e.target.value
                );
                field && handleFieldSelect(field);
              }}
              className="px-4 py-2 border rounded-md w-full"
            >
              <option value="">-- 項目を選択 --</option>
              {filterableField?.map((field) => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>
          {filterCondition.key && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">値を入力</label>
              {(() => {
                switch (filterCondition.type) {
                  case "string":
                    return (
                      <InputField
                        type="text"
                        value={filterCondition.value as string}
                        onChange={handleFieldValue}
                      />
                    );
                  case "number":
                    return (
                      <InputField
                        type="number"
                        value={filterCondition.value as number}
                        onChange={handleFieldValue}
                      />
                    );
                  case "Date":
                    return (
                      <InputField
                        type="date"
                        value={filterCondition.value as string}
                        onChange={handleFieldValue}
                      />
                    );
                  case "select":
                    return (
                      <SelectField
                        type={"text"}
                        value={filterCondition.value as string}
                        onChange={handleFieldValue}
                        options={getOptions(filterCondition.key)}
                      />
                    );
                  default:
                    return null;
                }
              })()}
              <button
                onClick={() => {
                  handleAddCondition(filterCondition);
                  setIsAdding(false);
                  resetFilterCondition();
                }}
              >
                条件を追加
              </button>
            </div>
          )}
        </>
      ) : (
        <button onClick={() => setIsAdding(true)}>+ 新規条件を追加</button>
      )}

      <LinkButtonGroup
        approve={{ text: "戻る", color: "red", onClick: backFilter }}
        deny={{
          text: "検索",
          color: "green",
          onClick: searchValue,
        }}
        reset={{ text: "リセット", color: "gray", onClick: () => {} }}
      />
    </Modal>
  );
};

export default Filter;
