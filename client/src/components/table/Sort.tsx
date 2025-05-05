import { createPortal } from "react-dom";
import { LinkButtonGroup } from "../buttons/index";
import { useSort } from "../../context/sort-context";
import { useEffect } from "react";

type SortProps<T> = {
  data: T[];
};

const Sort = <T extends Record<string, any>>({ data }: SortProps<T>) => {
  const {
    sortConditions,
    initializeSort,
    moveSortConditionUp,
    moveSortConditionDown,
    toggleAsc,
    handleSort,
    closeSort,
    resetSort,
  } = useSort();

  useEffect(() => {
    if (!data.length) return;
    initializeSort(data);
  }, [data]);

  const modalContent = (
    <div className="fixed inset-0 bg-gray-500/10 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-xl border border-gray-300 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {"並び替え"}
        </h3>
        <a className="text font-semibold text-gray-700 mb-4">
          {"並び替えたいキーを選択、並び替えてください。"}
        </a>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{"選択中"}</h2>
        <div>
          {sortConditions
            .filter((cond) => cond.asc !== null)
            .map((cond, index) => (
              <div key={cond.key} className="flex items-center gap-2">
                <span className="w-5 text-right">{index + 1}</span>
                <button onClick={() => moveSortConditionUp(index)}>↑</button>
                <button onClick={() => moveSortConditionDown(index)}>↓</button>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`order-${cond.key}`}
                      checked={cond.asc === true}
                      onClick={() => toggleAsc(cond.key, true)}
                      readOnly
                    />
                    昇順
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`order-${cond.key}`}
                      checked={cond.asc === false}
                      onClick={() => toggleAsc(cond.key, false)}
                      readOnly
                    />
                    降順
                  </label>
                </div>
                <span>{cond.key}</span>
              </div>
            ))}
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{"未選択"}</h2>
        <div>
          {sortConditions
            .filter((cond) => cond.asc === null)
            .map((cond) => (
              <div key={cond.key} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`order-${cond.key}`}
                      onChange={() => toggleAsc(cond.key, true)}
                    />
                    昇順
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`order-${cond.key}`}
                      onChange={() => toggleAsc(cond.key, false)}
                    />
                    降順
                  </label>
                </div>
                <span>{cond.key}</span>
              </div>
            ))}
        </div>
        <LinkButtonGroup
          approve={{
            text: "戻る",
            color: "red",
            onClick: closeSort,
          }}
          deny={{
            text: "並び替える",
            color: "green",
            onClick: handleSort,
          }}
          reset={{
            text: "リセット",
            color: "blue",
            onClick: resetSort,
          }}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Sort;
