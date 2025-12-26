import {
  FunnelIcon,
  Bars2Icon,
  Bars3Icon,
  AdjustmentsVerticalIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import {
  PlusCircleIcon,
  FolderPlusIcon,
  TableCellsIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";

import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { useForm } from "../../context/form-context";
import { FormTypeMap, ModelType } from "../../types/models";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "../../context/alert-context";
import { useAuth } from "../../context/auth-context";
import { DropDownMenu } from "../ui";
import { isDev } from "../../utils/env";
import Badges from "./Badges";
import { hasSteps } from "../../lib/form-steps";
import { AxiosResponse } from "axios";
import { useListView } from "../../context/listView-context";

type AddButtonProps = {
  menuItems: { label: string; onClick: () => void }[];
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isAddOpen: boolean;
  setIsAddOpen: (value: React.SetStateAction<boolean>) => void;
};

const AddButton = ({
  menuItems,
  dropdownRef,
  isAddOpen,
  setIsAddOpen,
}: AddButtonProps) => {
  const handleClick = () => {
    if (menuItems.length === 1) {
      // 1つだけ → 直接実行
      menuItems[0].onClick();
    } else {
      // 2つ以上 → dropdown 切り替え
      setIsAddOpen((prev) => !prev);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={handleClick}
        className="cursor-pointer flex items-center gap-x-2 text-blue-500"
        type="button"
      >
        <PlusCircleIcon className="w-8 h-8" />
        <span className="hidden lg:inline">新規追加</span>
      </button>

      {menuItems.length > 1 && isAddOpen && (
        <DropDownMenu
          menuItems={menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setIsAddOpen((prev) => !prev);
              }}
            >
              {item.label}
            </button>
          ))}
        />
      )}
    </div>
  );
};

type TableToolbarProps<K extends keyof FormTypeMap> = {
  modelType?: ModelType | null;
  uploadFile?: (file: File) => Promise<AxiosResponse<any, any, {}> | undefined>;
  downloadFile?: () => Promise<boolean>;
  formInitialData?: Partial<FormTypeMap[K]>;
  reloadFun?: () => Promise<void>;
  displayBadge?: boolean;
};

const TableToolbar = <K extends keyof FormTypeMap>({
  modelType,
  uploadFile,
  downloadFile,
  formInitialData,
  reloadFun,
  displayBadge,
}: TableToolbarProps<K>) => {
  const { openFilter } = useFilter();
  const { openSort } = useSort();
  const { createFormMenuItems } = useForm();
  const {
    main: { handleSetAlert },
  } = useAlert();

  const { staffState } = useAuth();

  const { rowSpacing, setRowSpacing, viewMode, setViewMode, triggerUpdate } =
    useListView();

  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
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
        setIsAddOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadFile) {
      handleSetAlert({ success: false, message: "未対応のモデルです" });
      return SetIsFolderOpen(false);
    }
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
      SetIsFolderOpen(false);

      triggerUpdate();
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

  const folderMenu = [
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

  const menuItems = modelType
    ? createFormMenuItems(modelType, formInitialData ? formInitialData : {})
    : [];

  const hasFormSteps: boolean = modelType ? hasSteps(modelType) : false;

  return (
    <div className="flex justify-between items-center bg-gray-200 border border-gray-200 p-2 rounded-md my-2">
      {/* 左側：フィルター・行間・ソート */}

      <div className="flex flex-wrap items-center gap-4">
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
            <span className="hidden lg:inline">広い</span>
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
            <span className="hidden lg:inline">狭い</span>
          </button>
        </div>
        {/* 表示方式ボタン */}
        <div className="flex">
          <button
            onClick={() => setViewMode("table")}
            className={`cursor-pointer flex items-center px-2 py-1 border rounded-md ${
              viewMode === "table"
                ? "bg-blue-500 text-white"
                : "border-gray-400 text-gray-700"
            }`}
          >
            <TableCellsIcon className="w-6 h-6" />
            <span className="hidden lg:inline">テーブル</span>
          </button>
          <button
            onClick={() => setViewMode("tile")}
            className={`cursor-pointer flex items-center px-2 py-1 border rounded-md ${
              viewMode === "tile"
                ? "bg-blue-500 text-white"
                : "border-gray-400 text-gray-700"
            }`}
          >
            <Squares2X2Icon className="w-6 h-6" />
            <span className="hidden lg:inline">タイル</span>
          </button>
        </div>

        {/* ソートを開くボタン */}
        <button
          className="cursor-pointer flex items-center gap-x-2"
          onClick={() => openSort()}
        >
          <AdjustmentsVerticalIcon className="w-6 h-6" />
          <span className="hidden lg:inline">ソート</span>
        </button>

        {/* フィルターを開くボタン */}
        <button
          className="cursor-pointer flex items-center gap-x-2"
          onClick={() => openFilter()}
        >
          <FunnelIcon className="w-6 h-6" />
          <span className="hidden lg:inline">フィルター</span>
        </button>

        <div className="flex">
          {displayBadge && <Badges handleUpdateTrigger={triggerUpdate} />}
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        {/* リロード */}
        {reloadFun && (
          <button
            className="cursor-pointer flex items-center gap-x-2"
            onClick={reloadFun}
          >
            <ArrowPathIcon className="w-6 h-6" />
            <span className="hidden lg:inline">リロード</span>
          </button>
        )}

        {modelType && (staffState.admin || isDev) && (
          <>
            {/* 右側：新規追加ボタン */}
            {hasFormSteps && (
              <AddButton
                menuItems={menuItems}
                dropdownRef={dropdownRef}
                isAddOpen={isAddOpen}
                setIsAddOpen={setIsAddOpen}
              />
            )}
            {/* 右側：フォルダーボタン */}
            {(uploadFile || downloadFile) && (
              <div
                ref={dropdownRef}
                className="relative inline-block text-left"
              >
                <button
                  onClick={() => SetIsFolderOpen(!isFolderOpen)}
                  className="cursor-pointer flex items-center gap-x-2 text-blue-500"
                  type="button"
                >
                  <FolderPlusIcon className="w-8 h-8" />
                  <span className="hidden lg:inline">CSV</span>
                </button>

                {isFolderOpen && <DropDownMenu menuItems={folderMenu} />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
