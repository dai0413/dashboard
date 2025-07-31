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
import { FormTypeMap, ModelType } from "../../types/models";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "../../context/alert-context";
import { useAuth } from "../../context/auth-context";
import { DropDownMenu } from "../ui";
import { isDev } from "../../utils/env";

type TableToolbarProps<K extends keyof FormTypeMap> = {
  rowSpacing: "wide" | "narrow";
  setRowSpacing: React.Dispatch<React.SetStateAction<"wide" | "narrow">>;
  modelType?: ModelType | null;
  uploadFile?: (file: File) => Promise<void>;
  downloadFile?: () => Promise<void>;
  formInitialData?: Partial<FormTypeMap[K]>;
};

const TableToolbar = <K extends keyof FormTypeMap>({
  rowSpacing,
  setRowSpacing,
  modelType,
  uploadFile,
  downloadFile,
  formInitialData,
}: TableToolbarProps<K>) => {
  const { openFilter } = useFilter();
  const { openSort } = useSort();
  const { openForm } = useForm();
  const {
    main: { handleSetAlert },
  } = useAlert();

  const { staffState } = useAuth();

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(uploadFile);
    if (!uploadFile) {
      handleSetAlert({ success: false, message: "未対応のモデルです" });
      return SetIsFolderOpen(false);
    }
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
      SetIsFolderOpen(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadFile) {
      handleSetAlert({ success: false, message: "未対応のモデルです" });
      return SetIsFolderOpen(false);
    }
    await downloadFile();
    SetIsFolderOpen(false);
  };

  const menu = [
    <label>
      Upload
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleUpload}
      />
    </label>,
    <button onClick={handleDownload}>Download</button>,
  ];

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

      {(staffState.admin || isDev) && (
        <div className="flex items-center gap-x-4">
          {/* 右側：新規追加ボタン */}
          <button
            onClick={() =>
              openForm(true, modelType || null, undefined, formInitialData)
            }
            className="cursor-pointer flex items-center gap-x-2 text-blue-500"
          >
            <PlusCircleIcon className="w-8 h-8" />
            <span className="hidden md:inline">新規追加</span>
          </button>

          {/* 右側：フォルダーボタン */}
          {(uploadFile || downloadFile) && (
            <div ref={dropdownRef} className="relative inline-block text-left">
              <button
                onClick={() => SetIsFolderOpen(!isFolderOpen)}
                className="cursor-pointer flex items-center gap-x-2 text-blue-500"
                type="button"
              >
                <FolderPlusIcon className="w-8 h-8" />
                <span className="hidden md:inline">CSV</span>
              </button>

              {isFolderOpen && <DropDownMenu menuItems={menu} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
