import { IconButton, IconTextButton, LinkButtonGroup } from "../buttons/index";
import { useFilter } from "../../context/filter-context";
import { useOptions } from "../../context/options-provider";
import { Modal } from "../ui";
import { FilterableFieldDefinition } from "../../types/field";
import FieldRow from "./Filter/FieldRow";

type FilterProps = {
  filterableField: FilterableFieldDefinition[];
  onApply: () => void;
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

    getFilterConditions,
  } = useFilter();

  const { getOptions } = useOptions();

  return (
    <Modal isOpen={filterOpen} onClose={closeFilter}>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">フィルター</h3>

      <section>
        <h4 className="text-md font-semibold text-gray-600 border-b pb-1 mb-2">
          条件
        </h4>

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
              <span>{getFilterConditions(cond)}</span>
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
      </section>

      <section className="mt-4 mb-4 space-y-1">
        {isAdding ? (
          <>
            <h4 className="text-md font-semibold text-gray-600 border-b pb-1 mb-2">
              追加する条件を編集
            </h4>

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
      </section>

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
