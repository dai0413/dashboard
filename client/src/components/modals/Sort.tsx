import { IconButton, LinkButtonGroup } from "../buttons/index";
import { useSort } from "../../context/sort-context";
import { useEffect } from "react";
import { Modal } from "../ui/index";
import { FilterableField } from "../../types/types";

type ToggleButtonAndLabelProps = {
  ascColor: boolean;
  dascColor: boolean;
  label: string;
  ascOnClick: () => void;
  dascOnClick: () => void;
};

const ToggleButtonAndLabel = ({
  ascColor,
  dascColor,
  label,
  ascOnClick,
  dascOnClick,
}: ToggleButtonAndLabelProps) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          className={`cursor-pointer px-2 py-1 rounded ${
            ascColor ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={ascOnClick}
        >
          昇順
        </button>
        <button
          className={`cursor-pointer px-2 py-1 rounded ${
            dascColor ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={dascOnClick}
        >
          降順
        </button>
      </div>
      <span>{label}</span>
    </>
  );
};

type SortProps = {
  sortableField: FilterableField[];
  onApply: () => void;
};

const Sort = ({ sortableField, onApply }: SortProps) => {
  const {
    sortOpen,
    sortConditions,
    moveSortConditionUp,
    moveSortConditionDown,
    toggleAsc,
    closeSort,
    resetSort,
    initializeSort,
  } = useSort();

  useEffect(() => {
    initializeSort(sortableField);
  }, [sortableField]);

  const selectingSortConditions = sortConditions.filter(
    (cond) => cond.asc !== null
  );

  const notSelectingSortConditions = sortConditions.filter(
    (cond) => cond.asc === null
  );

  return (
    <Modal isOpen={sortOpen} onClose={closeSort}>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">並び替え</h3>

      <section>
        <h4 className="text-md font-semibold text-gray-600 border-b pb-1 mb-2">
          選択中
        </h4>
        <div className="mb-4 space-y-1">
          {selectingSortConditions.map((cond, index) => {
            const actualIndex = sortConditions.findIndex(
              (c) => c.key === cond.key
            );

            return (
              <>
                <div key={cond.key} className="flex items-center gap-2">
                  <span className="w-5 text-right">{index + 1}</span>

                  <IconButton
                    icon="arrow-up"
                    onClick={() => moveSortConditionUp(actualIndex)}
                  />
                  <IconButton
                    icon="arrow-down"
                    onClick={() => moveSortConditionDown(actualIndex)}
                  />

                  <ToggleButtonAndLabel
                    ascColor={cond.asc === true}
                    dascColor={cond.asc === false}
                    label={cond.label}
                    ascOnClick={() => toggleAsc(cond.key, true)}
                    dascOnClick={() => toggleAsc(cond.key, false)}
                  />
                </div>
              </>
            );
          })}
        </div>
      </section>

      <section className="mb-4 space-y-1">
        <h4 className="text-md font-semibold text-gray-600 border-b pb-1 mb-2">
          未選択
        </h4>
        {notSelectingSortConditions.map((cond) => (
          <div key={cond.key} className="flex items-center gap-2">
            <ToggleButtonAndLabel
              ascColor={false}
              dascColor={false}
              label={cond.label}
              ascOnClick={() => toggleAsc(cond.key, true)}
              dascOnClick={() => toggleAsc(cond.key, false)}
            />
          </div>
        ))}
      </section>

      <LinkButtonGroup
        deny={{
          text: "並び替える",
          color: "green",
          onClick: onApply,
        }}
        reset={{
          text: "リセット",
          color: "gray",
          onClick: () => resetSort(sortableField),
        }}
      />
    </Modal>
  );
};

export default Sort;
