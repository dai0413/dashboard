import { JSX } from "react";
import { DetailFieldDefinition } from "../../types/field";
import { isLabelObject, toDateKey } from "../../utils";
import { FieldListData } from "../../types/types";

type FieldListProps = {
  fields: DetailFieldDefinition[];
  data: FieldListData;
  isEmpty?: boolean;
  isExclude?: boolean;
  diffColor?: boolean;
};

type DetailProps = {
  isForm: false;
};

type FormProps = {
  isForm: true;
  diffKeys?: string[];
};

type Props = (FieldListProps & DetailProps) | (FieldListProps & FormProps);

const FieldList = (props: Props) => {
  const { fields, data, isForm, isEmpty, isExclude, diffColor } = props;
  const diffKeys = isForm && props.diffKeys;

  const inputElements: JSX.Element[] = [];
  const emptyElements: JSX.Element[] = [];
  const excludedElements: JSX.Element[] = [];

  fields.forEach((field) => {
    let value;

    value =
      data[field.key as keyof typeof data] &&
      data[field.key as keyof typeof data].value;

    let onEdit = undefined;
    onEdit =
      data[field.key as keyof typeof data] &&
      data[field.key as keyof typeof data].onEdit;

    let displayValue: string | JSX.Element =
      typeof value === "undefined" || value === null ? "" : value;

    if (isLabelObject(value)) displayValue = value.label || "";

    if (typeof displayValue === "boolean") {
      displayValue = displayValue ? "TRUE" : "FALSE";
    }

    // // 日付フォーマット
    displayValue =
      field.type === "Date" &&
      value !== "" &&
      value !== "入力対象外" &&
      value !== "未入力"
        ? toDateKey(value as string | number | Date)
        : field.type === "datetime-local"
        ? toDateKey(value as string | number | Date, true)
        : displayValue;

    // // 配列の処理
    if (value && Array.isArray(value)) {
      if (typeof value[0] === "string") {
        displayValue = value.filter((u) => u.trim() !== "").join(", ");
      }
    }

    // URLの処理
    if (
      field.label === "URL" &&
      typeof value !== "string" &&
      value !== "未入力"
    ) {
      console.log("value", value);
      const urls = Array.isArray(value) ? value : [value];
      const validUrls = urls.filter(
        (u) => typeof u === "string" && u.trim() !== ""
      );

      displayValue = (
        <div className="flex gap-2">
          {validUrls.map((url, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              link-{index + 1}
            </a>
          ))}
        </div>
      );
    }

    const element = (
      <div
        key={field.key}
        className="grid grid-cols-2 items-center border-b py-1"
      >
        <span className="font-semibold">{field?.label ?? field.key}</span>

        <div className="flex justify-end items-center gap-4">
          <span
            className={
              //   !newData &&
              diffColor && diffKeys && diffKeys.includes(field.key)
                ? "text-red-500 font-semibold"
                : ""
            }
          >
            {displayValue}
          </span>
          {/* <span>{displayValue}</span> */}
          {value !== "入力対象外" && isForm && typeof onEdit === "function" && (
            <button className="font-semibold hover:underline" onClick={onEdit}>
              編集
            </button>
          )}
        </div>
      </div>
    );

    // 分類
    if (displayValue === "未入力" || displayValue === "未選択") {
      emptyElements.push(element);
    } else if (displayValue === "入力対象外") {
      excludedElements.push(element);
    } else {
      inputElements.push(element);
    }
  });

  return (
    <div className="space-y-2 text-sm text-gray-700">
      {isForm && (
        <div className="bg-gray-200 w-full p-1">
          <span className="font-bold">入力値</span>
        </div>
      )}
      {inputElements}

      {isForm && inputElements.length === 0 && (
        <div className="p-2 text-gray-500">なし</div>
      )}

      {isEmpty && isForm && (
        <div className="bg-gray-200 w-full p-1">
          <span className="font-bold">未入力</span>
        </div>
      )}

      {isEmpty && isForm && emptyElements.length === 0 && (
        <div className="p-2 text-gray-500">なし</div>
      )}

      {isEmpty && isForm && emptyElements.length > 0 && emptyElements}

      {isExclude && isForm && (
        <div className="bg-gray-200 w-full p-1">
          <span className="font-bold">入力対象外(自動計算など)</span>
        </div>
      )}

      {isExclude && isForm && excludedElements.length === 0 && (
        <div className="p-2 text-gray-500">なし</div>
      )}

      {isExclude && isForm && excludedElements.length > 0 && excludedElements}
    </div>
  );
};

export default FieldList;
