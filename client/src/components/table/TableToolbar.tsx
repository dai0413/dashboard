import {
  FunnelIcon,
  Bars2Icon,
  Bars3Icon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/outline";

import { PlusCircleIcon } from "@heroicons/react/24/solid";

import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { useForm } from "../../context/form-context";
import { ModelType } from "../../types/models";

type TableToolbarProps = {
  rowSpacing: "wide" | "narrow";
  setRowSpacing: React.Dispatch<React.SetStateAction<"wide" | "narrow">>;
  modelType?: ModelType | null;
};

const TableToolbar = ({
  rowSpacing,
  setRowSpacing,
  modelType,
}: TableToolbarProps) => {
  const { openFilter } = useFilter();
  const { openSort } = useSort();
  const { openForm } = useForm();

  return (
    <div className="flex justify-between items-center bg-gray-200 border border-gray-200 p-2 rounded-md my-2">
      {/* 左側：フィルター・行間・ソート */}
      <div className="flex items-center gap-x-4">
        {/* 行間操作ボタン */}
        <div className="flex">
          <button
            onClick={() => setRowSpacing("wide")}
            className={`cursor-pointer flex items-center px-2 py-1 border rounded-md ${
              rowSpacing === "wide"
                ? "bg-blue-500 text-white"
                : "border-gray-400 text-gray-700"
            }`}
          >
            <Bars2Icon className="w-6 h-6" />
            <span className="hidden md:inline">広い</span>
          </button>
          <button
            onClick={() => setRowSpacing("narrow")}
            className={`cursor-pointer flex items-center px-2 py-1 border rounded-md ${
              rowSpacing === "narrow"
                ? "bg-blue-500 text-white"
                : "border-gray-400 text-gray-700"
            }`}
          >
            <Bars3Icon className="w-6 h-6" />
            <span className="hidden md:inline">狭い</span>
          </button>
        </div>

        {/* フィルターを開くボタン */}
        <button
          className="cursor-pointer flex items-center gap-x-2"
          onClick={() => openFilter()}
        >
          <FunnelIcon className="w-6 h-6" />
          <span className="hidden md:inline">フィルター</span>
        </button>

        {/* ソートを開くボタン */}
        <button
          className="cursor-pointer flex items-center gap-x-2"
          onClick={() => openSort()}
        >
          <AdjustmentsVerticalIcon className="w-6 h-6" />
          <span className="hidden md:inline">ソート</span>
        </button>
      </div>

      {/* 右側：新規追加ボタン */}
      <button
        onClick={() => openForm(modelType || null)}
        className="cursor-pointer flex items-center gap-x-2 text-blue-500"
      >
        <PlusCircleIcon className="w-8 h-8" />
        <span className="hidden md:inline">新規追加</span>
      </button>
    </div>
  );
};

export default TableToolbar;
