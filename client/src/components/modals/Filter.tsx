import { IconButton, IconTextButton, LinkButtonGroup } from "../buttons/index";
import { useFilter } from "../../context/filter-context";
import { Modal } from "../ui";
import { FilterableField, FilterCondition } from "../../types/types";
import { OptionArray, useOptions } from "../../context/options-provider";
import FieldRow from "./Filter/FieldRow";

type FilterProps = {
  filterableField: FilterableField[];
  onApply: () => void;
};
const createNowFilterString = (
  cond: FilterCondition,
  operatorOptions: OptionArray
): string => {
  const nowOperator = operatorOptions.find(
    (op) => op.key === cond.operator
  )?.label;

  const nowValue =
    cond.type === "Date" && cond.value instanceof Date
      ? cond.value.toISOString().slice(0, 10)
      : String(cond.value);

  const now = `${cond.label} が ${nowValue} ${nowOperator}`;
  return now;
};

const Filter = ({ filterableField, onApply }: FilterProps) => {
  const {
    filterOpen,

    filterConditions,
    handleAddCondition,

    filterCondition,
    handleFieldSelect,
    handleFieldValue,
    handleFieldOperator,

    handleEdit,
    handleDelete,

    closeFilter,

    editingIndex,
    isAdding,
    toggleAdding,
  } = useFilter();

  const { getOptions } = useOptions();

  return (
    <Modal isOpen={filterOpen} onClose={closeFilter}>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">フィルター</h3>

      <div className="mb-4 space-y-2">
        <label className="block text-gray-700 font-semibold">条件</label>
        {filterConditions.length === 0 && (
          <div className="bg-gray-50 border px-4 py-2 text-sm text-gray-500 rounded">
            条件は設定されていません
          </div>
        )}

        {filterConditions.map((cond, index) => {
          if (!cond.key) return null;
          const isEditing = editingIndex === index;

          return isEditing ? (
            <FieldRow
              key={index}
              filterCondition={filterCondition}
              options={{
                fieldOptions: filterableField,
                valueOptions: getOptions(filterCondition.key),
                operatorOptions: getOptions("operator"),
              }}
              onChange={{
                handleFieldValue: handleFieldValue,
                handleFieldOperator: handleFieldOperator,
                handleFieldSelect: (e) => {
                  const field = filterableField.find((f) => f.key === e);
                  field && handleFieldSelect(field);
                },
              }}
              onApply={{
                addOnClick: () => handleAddCondition(index),
                deleteOnClick: () => handleDelete(index),
              }}
            />
          ) : (
            <div
              key={index}
              className="flex justify-between items-center bg-green-100 px-3 py-2 rounded-md"
            >
              <span>{createNowFilterString(cond, getOptions("operator"))}</span>
              <div className="space-x-2 flex">
                <IconButton
                  icon="edit"
                  onClick={() => handleEdit(index)}
                  color="gray"
                />
                <IconButton
                  icon="delete"
                  onClick={() => handleDelete(index)}
                  color="red"
                />
              </div>
            </div>
          );
        })}

        {isAdding ? (
          <>
            <label className="block text-gray-700 font-semibold">
              追加する条件を編集
            </label>

            <FieldRow
              filterCondition={filterCondition}
              options={{
                fieldOptions: filterableField,
                valueOptions: getOptions(filterCondition.key),
                operatorOptions: getOptions("operator"),
              }}
              onChange={{
                handleFieldValue: handleFieldValue,
                handleFieldOperator: handleFieldOperator,
                handleFieldSelect: (e) => {
                  const field = filterableField.find((f) => f.key === e);
                  field && handleFieldSelect(field);
                },
              }}
              onApply={{
                addOnClick: handleAddCondition,
                deleteOnClick: toggleAdding,
              }}
            />
          </>
        ) : (
          <IconTextButton icon="add" color="blue" onClick={toggleAdding}>
            条件を追加
          </IconTextButton>
        )}
      </div>

      <LinkButtonGroup
        deny={{
          text: "検索",
          color: "green",
          onClick: onApply,
        }}
        reset={{ text: "リセット", color: "gray", onClick: closeFilter }}
      />
    </Modal>
  );
};

export default Filter;
