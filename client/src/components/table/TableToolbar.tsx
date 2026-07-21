import {
  FunnelIcon,
  Bars2Icon,
  Bars3Icon,
  AdjustmentsVerticalIcon,
  ArrowPathIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

import {
  PlusCircleIcon,
  FolderPlusIcon,
  TableCellsIcon,
  Squares2X2Icon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { useForm } from "../../context/form-context";
import { GettedModelDataMap, ModelType } from "../../types/models";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "../../context/alert-context";
import { useAuth } from "../../context/auth-context";
import { DropDownMenu } from "../ui";
import { isDev } from "../../utils/env";
import QuickFilterBar from "./QuickFilterBar";
import { hasSteps } from "../../lib/form-steps/core/hasSteps";
import { AxiosResponse } from "axios";
import { useListView } from "../../context/listView-context";
import { useModal } from "../../context/modal-context";
import { QuickFilterItem, TableHeader } from "../../types/table";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { createFormMenuItems } from "../../lib/form-steps/core/createFormMenuItems";
import { FormMode, From, InputMode, ViewMode } from "../../types/types";
import CheckMenuItem from "../ui/CheckMenuItem";
import { useModelContext } from "../../context/models/model-wrapper";

type MenuItem = { label: string; onClick: () => void };

type AddButtonProps = {
  menuItems: MenuItem[];
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
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        />
      )}
    </div>
  );
};

type TableToolbarProps<Data, Form> = {
  modelType?: ModelType | null;
  uploadFile?: (file: File) => Promise<AxiosResponse<any, any, {}> | undefined>;
  downloadFile?: () => Promise<boolean>;
  initialData?: {
    formData?: Partial<Form>;
    metaData?: Record<string, any>;
  };
  reloadFun?: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
  quickFilterItems: QuickFilterItem[];
  headers?: TableHeader<Data>[];
  items?: Data[];
};

const TableToolbar = <Data, Form>({
  modelType,
  uploadFile,
  downloadFile,
  initialData,
  reloadFun,
  quickFilterItems,
  headers,
  items,
}: TableToolbarProps<Data, Form>) => {
  const { openFilter, filterConditions } = useFilter();
  const { openSort, sortConditions } = useSort();
  const {
    formOperator: { startForm },
  } = useForm();
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
    columnVisibility,
    setColumnVisibility,
  } = useListView();

  const {
    form: { isOpen, open },
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
  const [isFolderOpen, setIsFolderOpen] = useState<boolean>(false);
  const [isFieldSelectOpen, setIsFieldSelectOpen] = useState<boolean>(false);
  const addDropdownRef = useRef<HTMLDivElement | null>(null);
  const folderDropdownRef = useRef<HTMLDivElement | null>(null);
  const fieldSelectRef = useRef<HTMLDivElement | null>(null);

  const onClickTable = () => {
    setViewMode(ViewMode.TABLE);
    setItemsPerPage(10);
  };

  const onClickTile = () => {
    if (
      isOpen &&
      (modelType === ModelType.TEAM_COMPETITION_SEASON ||
        modelType === ModelType.FORMATION)
    ) {
      setItemsPerPage(20);
    } else {
      setItemsPerPage(10);
    }

    setViewMode(ViewMode.TILE);
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

      if (fieldSelectRef.current && fieldSelectRef.current.contains(target)) {
        return;
      }

      setIsAddDropDownOpen(false);
      setIsFolderOpen(false);
      setIsFieldSelectOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadFile) {
      handleSetAlert({ success: false, message: "未対応のモデルです" });
      return setIsFolderOpen(false);
    }
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
      setIsFolderOpen(false);

      triggerUpdate();
    }
  };

  const handleDownload = async () => {
    if (!downloadFile) {
      handleSetAlert({ success: false, message: "未対応のモデルです" });
      return setIsFolderOpen(false);
    }
    await downloadFile();
    setIsFolderOpen(false);
  };

  const modelContext = modelType && useModelContext(modelType);

  const deleteOnClick = async () => {
    if (!modelContext || !items) return;
    const { deleteItems } = modelContext;

    const confirmDelete = window.confirm(
      `${modelType}:${items.length}件のデータを本当に削除しますか？`,
    );
    if (confirmDelete) {
      const result = await deleteItems(items);

      if (result && reloadFun) reloadFun(filterConditions, sortConditions);
    }
  };

  const folderMenu = [
    <label className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
      Upload
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleUpload}
      />
    </label>,
    <button
      onClick={handleDownload}
      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      Download
    </button>,
  ];

  const menuItems: MenuItem[] = modelType
    ? createFormMenuItems(modelType)
        .filter((item) => item.label)
        .map((item) => {
          const { label, ...rest } = item;
          return {
            label: item.label,
            onClick: async () =>
              startForm({
                ...rest,
                formMode: FormMode.CREATE,
                initialData: initialData ? initialData : undefined,
              }),
          };
        })
    : [];

  const handleSelectAll = (headers: TableHeader<Data>[]) => {
    const next: Record<string, boolean> = {};

    headers.forEach((h) => {
      next[h.key] = true;
    });

    setColumnVisibility(next);
  };

  const handleClearAll = (headers: TableHeader<Data>[]) => {
    const next: Record<string, boolean> = {};

    headers.forEach((h) => {
      next[h.key] = false;
    });

    setColumnVisibility(next);
  };

  const fieldSelectMenuItems = headers
    ? [
        <button
          key="select-all"
          onClick={() => handleSelectAll(headers)}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          すべて表示
        </button>,

        <button
          key="clear-all"
          onClick={() => handleClearAll(headers)}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          すべて非表示
        </button>,

        <div key="divider" className="border-t my-1" />,

        ...headers.map((h) => (
          <CheckMenuItem
            key={h.key}
            label={h.label}
            checked={columnVisibility[h.key]}
            onChange={() =>
              setColumnVisibility({
                ...columnVisibility,
                [h.key]: !columnVisibility[h.key],
              })
            }
          />
        )),
      ]
    : [];

  const hasFormSteps: boolean = modelType ? hasSteps(modelType) : false;

  const startUpdates = async () => {
    if (modelType && items) {
      const success = await startForm({
        modelType,
        formMode: FormMode.UPDATE,
        inputMode: InputMode.MANY,
        ids: [],
        editItem: items as GettedModelDataMap[typeof modelType][],
        from: From.NORMAL,
      });
      if (success) openForm();
    }
  };

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

        <div className="relative" ref={fieldSelectRef}>
          <button
            onClick={() => setIsFieldSelectOpen((prev) => !prev)}
            className="cursor-pointer flex items-center gap-x-2"
          >
            <ViewColumnsIcon className="w-6 h-6" />
            <span className="hidden lg:inline">フィールド</span>
          </button>

          {isFieldSelectOpen && (
            <DropDownMenu menuItems={fieldSelectMenuItems} />
          )}
        </div>

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

        <div className="flex">
          {quickFilterItems.length > 0 && (
            <QuickFilterBar
              items={quickFilterItems}
              loading={false}
              reloadFun={reloadFun}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        {/* リロード */}
        {reloadFun && (
          <button
            className="cursor-pointer flex items-center gap-x-2"
            onClick={() => reloadFun(filterConditions, sortConditions)}
          >
            <ArrowPathIcon className="w-6 h-6" />
            <span className="hidden lg:inline">リロード</span>
          </button>
        )}

        {modelType && (staffState.admin || isDev) && (
          <>
            {items && items.length > 0 && (
              <div className="relative inline-block text-left">
                <button
                  onClick={startUpdates}
                  className="cursor-pointer flex items-center gap-x-2 text-blue-500"
                  type="button"
                >
                  <PencilSquareIcon className="w-8 h-8" />
                  <span className="hidden lg:inline">修正</span>
                </button>
              </div>
            )}
            {items && items.length > 0 && (
              <div className="relative inline-block text-left">
                <button
                  onClick={deleteOnClick}
                  className="cursor-pointer flex items-center gap-x-2 text-blue-500"
                  type="button"
                >
                  <TrashIcon className="w-8 h-8" />
                  <span className="hidden lg:inline">削除</span>
                </button>
              </div>
            )}
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
                  onClick={() => setIsFolderOpen(!isFolderOpen)}
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
