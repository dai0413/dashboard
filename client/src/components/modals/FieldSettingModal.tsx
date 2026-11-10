import { useEffect, useMemo, useState } from "react";
import { IconButton, LinkButtonGroup } from "../buttons";
import { Modal } from "../ui";
import { DisplayFields } from "../../types/field";

type Props<T extends DisplayFields> = {
  fields: T[];
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  updateFields: (fields: T[]) => void;
  mode: "sort" | "field";
};

export const FieldSettingModal = <T extends DisplayFields>({
  fields,
  isOpen,
  onClose,
  onReset,
  updateFields,
  mode,
}: Props<T>) => {
  const [editingFields, setEditingFields] = useState(fields);

  useEffect(() => {
    if (!isOpen) return;
    setEditingFields(fields);
  }, [isOpen, fields]);

  const selectingFields = useMemo(
    () => editingFields.filter((f) => f.selecting),
    [editingFields],
  );
  const notSelectingFields = useMemo(
    () => editingFields.filter((f) => !f.selecting),
    [editingFields],
  );

  const toggleSelecting = (key: string) => {
    setEditingFields((prev) =>
      prev.map((f) =>
        f.key === key
          ? { ...f, selecting: !f.selecting, asc: f.selecting ? null : f.asc }
          : f,
      ),
    );
  };

  const moveField = (key: string, direction: "up" | "down") => {
    setEditingFields((prev) => {
      const selecting = prev.filter((f) => f.selecting);
      const index = selecting.findIndex((f) => f.key === key);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || targetIndex < 0 || targetIndex >= selecting.length)
        return prev;

      const next = [...selecting];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

      let i = 0;
      return prev.map((f) => (f.selecting ? next[i++] : f));
    });
  };

  const toggleSort = (key: string, asc: boolean) => {
    setEditingFields((prev) =>
      prev.map((f) => {
        if (f.key !== key) return f;
        if (f.selecting) return { ...f, asc: f.asc === asc ? null : asc };
        return { ...f, selecting: true, asc };
      }),
    );
  };

  const handleApply = () => {
    updateFields(editingFields);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <h3 className="text-xl font-semibold text-gray-800">
          {mode === "sort" ? "並び替え" : "表示する値"}
        </h3>
      }
      footer={
        <LinkButtonGroup
          deny={{
            text: mode === "sort" ? "並び替える" : "表示する",
            color: "green",
            onClick: handleApply,
          }}
          reset={{ text: "リセット", color: "gray", onClick: onReset }}
        />
      }
    >
      <div className="space-y-6 pr-1">
        {/* 選択中 */}
        <Section
          title={mode === "sort" ? "並び替え条件" : "選択中"}
          count={selectingFields.length}
          hint={mode === "sort" ? "上にあるものほど優先されます" : undefined}
        >
          {selectingFields.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-300 py-4 text-center text-sm text-gray-400">
              {mode === "sort"
                ? "下の一覧から条件を選んでください"
                : "表示する値がありません"}
            </p>
          ) : (
            selectingFields.map((field, index) => (
              <Row key={field.key} highlighted>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {index + 1}
                </span>

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                  {field.label}
                </span>

                {mode === "sort" && (
                  <SortToggle
                    asc={field.asc}
                    onAsc={() => toggleSort(field.key, true)}
                    onDesc={() => toggleSort(field.key, false)}
                  />
                )}

                <div className="flex shrink-0 items-center gap-1">
                  <IconButton
                    icon="arrow-up"
                    aria-label="上へ移動"
                    disabled={index === 0}
                    onClick={() => moveField(field.key, "up")}
                  />
                  <IconButton
                    icon="arrow-down"
                    aria-label="下へ移動"
                    disabled={index === selectingFields.length - 1}
                    onClick={() => moveField(field.key, "down")}
                  />
                  <button
                    type="button"
                    className="ml-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => toggleSelecting(field.key)}
                  >
                    {mode === "sort" ? "解除" : "削除"}
                  </button>
                </div>
              </Row>
            ))
          )}
        </Section>

        {/* 未選択 */}
        <Section title="未選択" count={notSelectingFields.length}>
          {notSelectingFields.map((field) => (
            <Row key={field.key}>
              <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                {field.label}
              </span>

              {mode === "sort" ? (
                <SortToggle
                  asc={null}
                  onAsc={() => toggleSort(field.key, true)}
                  onDesc={() => toggleSort(field.key, false)}
                />
              ) : (
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-blue-500 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => toggleSelecting(field.key)}
                >
                  ＋ 追加
                </button>
              )}
            </Row>
          ))}
        </Section>
      </div>
    </Modal>
  );
};

/* ---------- 部品 ---------- */

const Section = ({
  title,
  count,
  hint,
  children,
}: {
  title: string;
  count: number;
  hint?: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="mb-2 flex items-baseline gap-2 border-b pb-1">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <span className="rounded-full bg-gray-100 px-2 text-xs text-gray-500">
        {count}
      </span>
      {hint && <span className="ml-auto text-xs text-gray-400">{hint}</span>}
    </div>
    <div className="space-y-2">{children}</div>
  </section>
);

const Row = ({
  highlighted = false,
  children,
}: {
  highlighted?: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
      highlighted
        ? "border-blue-200 bg-blue-50/40"
        : "border-gray-200 bg-white hover:bg-gray-50"
    }`}
  >
    {children}
  </div>
);

const SortToggle = ({
  asc,
  onAsc,
  onDesc,
}: {
  asc?: boolean | null;
  onAsc: () => void;
  onDesc: () => void;
}) => {
  const base = "px-3 py-1 text-xs font-medium transition-colors";
  const active = "bg-blue-500 text-white";
  const inactive = "bg-white text-gray-600 hover:bg-gray-100";

  return (
    <div
      role="group"
      className="inline-flex shrink-0 overflow-hidden rounded-md border border-gray-300"
    >
      <button
        type="button"
        aria-pressed={asc === true}
        className={`${base} ${asc === true ? active : inactive}`}
        onClick={onAsc}
      >
        ↑ 昇順
      </button>
      <button
        type="button"
        aria-pressed={asc === false}
        className={`${base} border-l border-gray-300 ${
          asc === false ? active : inactive
        }`}
        onClick={onDesc}
      >
        ↓ 降順
      </button>
    </div>
  );
};
