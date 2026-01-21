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
import { useModal } from "../../context/modal-context";

type AddButtonProps = {
  menuItems: { label: string; onClick: () => void }[];
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isAddDropDownOpen: boolean;
  setIsAddDropDownOpen: (value: React.SetStateAction<boolean>) => void;
  openForm: () => void;
};

const AddButton = ({
  menuItems,
  dropdownRef,
  isAddDropDownOpen,
  setIsAddDropDownOpen,
  openForm,
}: AddButtonProps) => {
  const handleClick = () => {
    if (menuItems.length === 1) {
      // 1つだけ → 直接実行
      menuItems[0].onClick();
      openForm();
    } else {
      // 2つ以上 → dropdown 切り替え
      setIsAddDropDownOpen((prev) => !prev);
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

      {menuItems.length > 1 && isAddDropDownOpen && (
        <DropDownMenu
          menuItems={menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setIsAddDropDownOpen((prev) => !prev);
                openForm();
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
  const { openFilter, filterConditions } = useFilter();
  const { openSort, sortConditions } = useSort();
  const { createFormMenuItems } = useForm();
  const {
    main: { handleSetAlert },
  } = useAlert();

  const { staffState } = useAuth();

  const {
    rowSpacing,
    setRowSpacing,
    viewMode,
    setViewMode,
    triggerUpdate,
    setItemsPerPage,
  } = useListView();

  const {
    form: { open },
  } = useModal();

  const openForm = () => {
    if (modelType) {
      open(modelType);
    } else {
      handleSetAlert({
        success: false,
        message: "フォームの開閉に失敗しました",
      });
    }
  };

  const [isAddDropDownOpen, setIsAddDropDownOpen] = useState<boolean>(false);
  const [isFolderOpen, SetIsFolderOpen] = useState<boolean>(false);
  const addDropdownRef = useRef<HTMLDivElement | null>(null);
  const folderDropdownRef = useRef<HTMLDivElement | null>(null);

  const onClickTable = () => {
    setViewMode("table");
    setItemsPerPage(10);
  };

  const onClickTile = () => {
    if (
      modelType === ModelType.TEAM_COMPETITION_SEASON ||
      modelType === ModelType.FORMATION
    ) {
      setItemsPerPage(20);
    } else {
      setItemsPerPage(10);
    }

    setViewMode("tile");
  };

  useEffect(() => {
    if (
      modelType === ModelType.TEAM_COMPETITION_SEASON ||
      modelType === ModelType.FORMATION
    ) {
      onClickTile();
    } else {
      onClickTable();
    }
  }, [modelType]);

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (addDropdownRef.current && addDropdownRef.current.contains(target)) {
        return;
      }

      if (
        folderDropdownRef.current &&
        folderDropdownRef.current.contains(target)
      ) {
        return;
      }

      setIsAddDropDownOpen(false);
      SetIsFolderOpen(false);
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
            onClick={onClickTable}
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
            onClick={onClickTile}
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
        {/* <button
          className="cursor-pointer flex items-center gap-x-2"
          onClick={() => openSort()}
        >
          <AdjustmentsVerticalIcon className="w-6 h-6" />
          <span className="hidden lg:inline">ソート</span>
        </button> */}
        <button
          className="cursor-pointer flex items-center gap-x-2 relative"
          onClick={() => openSort()}
        >
          <AdjustmentsVerticalIcon className="w-6 h-6" />
          {sortConditions.filter((c) => typeof c.asc === "boolean").length >
            0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
      rounded-full bg-blue-500 text-white text-xs flex items-center justify-center"
            >
              {sortConditions.filter((c) => typeof c.asc === "boolean").length}
            </span>
          )}
          <span className="hidden lg:inline">ソート</span>
        </button>

        {/* フィルターを開くボタン */}
        <button
          className="cursor-pointer flex items-center gap-x-2 relative"
          onClick={() => openFilter()}
        >
          <FunnelIcon className="w-6 h-6" />
          {filterConditions.length > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
      rounded-full bg-blue-500 text-white text-xs flex items-center justify-center"
            >
              {filterConditions.length}
            </span>
          )}
          <span className="hidden lg:inline">フィルター</span>
        </button>

        <div className="flex">{displayBadge && <Badges />}</div>
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
                dropdownRef={addDropdownRef}
                isAddDropDownOpen={isAddDropDownOpen}
                setIsAddDropDownOpen={setIsAddDropDownOpen}
                openForm={openForm}
              />
            )}
            {/* 右側：フォルダーボタン */}
            {(uploadFile || downloadFile) && (
              <div
                ref={folderDropdownRef}
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
