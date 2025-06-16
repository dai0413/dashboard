import {
  FunnelIcon,
  Bars2Icon,
  Bars3Icon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/outline";

import { PlusCircleIcon, FolderPlusIcon } from "@heroicons/react/24/solid";

import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { useForm } from "../../context/form-context";
import { ModelType } from "../../types/models";
import { useEffect, useRef, useState } from "react";

type TableToolbarProps = {
  rowSpacing: "wide" | "narrow";
  setRowSpacing: React.Dispatch<React.SetStateAction<"wide" | "narrow">>;
  modelType?: ModelType | null;
  uploadFile?: (file: File) => Promise<void>;
};

const TableToolbar = ({
  rowSpacing,
  setRowSpacing,
  modelType,
  uploadFile,
}: TableToolbarProps) => {
  const { openFilter } = useFilter();
  const { openSort } = useSort();
  const { openForm } = useForm();

  const [isFolderOpen, SetIsFolderOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        SetIsFolderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadFile) {
      return window.console.error("未対応のモデルです");
    }
    const file = e.target.files?.[0];
    if (file) {
      SetIsFolderOpen(false);
      await uploadFile(file);
    }
  };

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

      <div className="flex items-center gap-x-4">
        {/* 右側：新規追加ボタン */}
        <button
          onClick={() => openForm(true, modelType || null)}
          className="cursor-pointer flex items-center gap-x-2 text-blue-500"
        >
          <PlusCircleIcon className="w-8 h-8" />
          <span className="hidden md:inline">新規追加</span>
        </button>

        {/* 右側：フォルダーボタン */}
        <div ref={dropdownRef} className="relative inline-block text-left">
          <button
            onClick={() => SetIsFolderOpen(!isFolderOpen)}
            className="cursor-pointer flex items-center gap-x-2 text-blue-500"
            type="button"
          >
            <FolderPlusIcon className="w-8 h-8" />
            <span className="hidden md:inline">CSV</span>
          </button>

          {isFolderOpen && (
            <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <label className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                    Input CSV
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </li>
                <li>
                  <button
                    onClick={() => {
                      SetIsFolderOpen(false);
                      console.log("Output selected");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Output
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableToolbar;
