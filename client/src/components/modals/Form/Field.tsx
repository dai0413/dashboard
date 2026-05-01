import { InputField, SelectField } from "../../field";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { resolveOptionSource } from "../../../types/field";
import { FormTypeMap } from "../../../types/models";
import { getDefaultOptions } from "../../../utils/createOption/createOption";
import {
  DefaultOptionMap,
  OptionsMap,
  OptionType,
} from "../../../utils/createOption/types/base";
import {
  ModelDataOptions,
  OptionArray,
  OptionSource,
  OptionTable,
} from "../../../types/form/option";
import { FormFieldDefinition } from "../../../types/form/field";
import { getOptionKey } from "../../../lib/options";
import { OptionProvider } from "../../../context/options-provider";
import { HandleFormData } from "../../../types/form/handleFormData";
import { UpdateMode } from "../../../types/form";
import { TableFieldRenderer } from "./Field/renderers/TableFieldRenderer";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FormFieldDefinition<T>;
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  handleFormData: HandleFormData<T>;
  supportButton?: boolean;
  options: Record<string, OptionArray | OptionTable<any>>;
};

export const RenderFieldBase = <T extends keyof FormTypeMap>({
  field,
  formData,
  formLabel,
  handleFormData,
  supportButton,
  options,
}: RenderFieldProps<T>) => {
  const { multi, key, fieldType, valueType, uniqueInArray, lengthInArray } =
    field;
  const formDataKey = key as keyof FormTypeMap[T];

  const [optionKey, setOptionKey] = useState<keyof OptionsMap>(
    OptionType.OPERATOR,
  );
  const [optionTableData, setOptionTableData] =
    useState<ModelDataOptions<any> | null>(null);
  const [optionIsLoading, setOptionIsLoading] = useState<boolean>(false);
  const [optionSource, setOptionSource] = useState<OptionSource>(
    OptionSource.PRESET,
  );

  const [optionSelectData, setOptionSelectData] = useState<OptionArray | null>(
    null,
  );

  useEffect(() => {
    if (!key) return;

    const nextOptionKey = getOptionKey(key);
    const source = resolveOptionSource(nextOptionKey);

    if (!source) return;
    setOptionKey(nextOptionKey);
    setOptionSource(source);

    if (source === OptionSource.PRESET) {
      const options = getDefaultOptions(
        nextOptionKey as keyof DefaultOptionMap,
      );
      setOptionSelectData(options);
    }

    if (source === OptionSource.CUSTOM && nextOptionKey in options) {
      const optionData = options[nextOptionKey];

      if (Array.isArray(optionData)) {
        setOptionSelectData(optionData);
      } else {
        setOptionTableData({
          option: optionData,
          page: 1,
          totalCount: 1,
        });
      }
    }
  }, [key]);

  const formDataValue = get(formData, formDataKey);
  const formDataLabel = get(formLabel, formDataKey) || "";

  if (fieldType === "table")
    return (
      <TableFieldRenderer
        value={formDataValue}
        label={formDataLabel}
        formDataKey={formDataKey}
        field={field}
        optionKey={optionKey}
        optionTableData={optionTableData}
        optionIsLoading={optionIsLoading}
        optionSource={optionSource}
        handleFormData={handleFormData}
        setOptionIsLoading={setOptionIsLoading}
        setOptionTableData={setOptionTableData}
      />
    );

  if (multi && fieldType === "textarea")
    return (
      <>
        {[
          ...(formDataValue && (formDataValue as string[]).length > 0
            ? (formDataValue as string[])
            : [""]), // 空配列なら1つだけ空の入力欄を出す
        ].map((item: string, index: number) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={item}
              onChange={(e) => {
                const value = e.target.value;

                handleFormData({
                  key: formDataKey,
                  value: value as FormTypeMap[T][typeof formDataKey],
                  field,
                  index,
                  updateMode: UpdateMode.ARRAY_UPDATE,
                });
              }}
            />

            <button
              type="button"
              onClick={() => {
                handleFormData({
                  key: formDataKey,
                  value: undefined,
                  field,
                  updateMode: UpdateMode.ARRAY_UPDATE,
                  index: index,
                });
              }}
              className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        ))}

        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={""}
          onChange={(e) => {
            handleFormData({
              key: formDataKey,
              value: e.target.value as FormTypeMap[T][typeof formDataKey],
              field,
              index: ((formDataValue as string[]) || []).length,
              updateMode: UpdateMode.ARRAY_UPDATE,
            });
          }}
        />
      </>
    );

  if (multi && fieldType === "select" && optionSelectData && uniqueInArray) {
    let options = optionSelectData;
    const selected = ((formDataValue as string[]) || []).filter(
      (v) => v !== "",
    );
    if (Array.isArray(selected)) {
      options = optionSelectData.filter((item) => {
        return !selected.includes(item.key);
      });
    }

    const getUniqueOptions = (index: number) => {
      const used = new Set(selected.slice(0, index));
      return optionSelectData.filter((item) => !used.has(item.key));
    };

    return (
      <>
        {[...((formDataValue as string[]) ?? [])].map(
          (item: string, index: number) => {
            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <SelectField
                  type={valueType}
                  value={item}
                  onChange={(value) => {
                    handleFormData({
                      key: formDataKey,
                      value: value as FormTypeMap[T][typeof formDataKey],
                      field,
                      index,
                      updateMode: UpdateMode.ARRAY_UPDATE,
                    });
                  }}
                  options={getUniqueOptions(index)}
                  defaultOption="--- 未選択 ---"
                  displayClearButton={true}
                />
              </div>
            );
          },
        )}

        {!!lengthInArray && lengthInArray >= selected.length && (
          <SelectField
            type={valueType}
            value={""}
            onChange={(value) => {
              handleFormData({
                key: formDataKey,
                value: value as FormTypeMap[T][typeof formDataKey],
                field,
              });
            }}
            options={options}
            defaultOption="--- 未選択 ---"
            displayClearButton={true}
          />
        )}
      </>
    );
  }

  if (multi && fieldType === "select" && optionSelectData) {
    return (
      <>
        {[...((formDataValue as string[]) ?? [])].map(
          (item: string, index: number) => {
            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <SelectField
                  type={valueType}
                  value={item}
                  onChange={(value) => {
                    handleFormData({
                      key: formDataKey,
                      value: value as FormTypeMap[T][typeof formDataKey],
                      field,
                      index,
                      updateMode: UpdateMode.ARRAY_UPDATE,
                    });
                  }}
                  options={optionSelectData}
                  defaultOption="--- 未選択 ---"
                  displayClearButton={true}
                />

                <button
                  type="button"
                  onClick={() => {
                    handleFormData({
                      key: formDataKey,
                      value: undefined,
                      field,
                      updateMode: UpdateMode.ARRAY_UPDATE,
                      index: index,
                    });
                  }}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            );
          },
        )}

        <SelectField
          type={valueType}
          value={""}
          onChange={(value) => {
            handleFormData({
              key: formDataKey,
              value: value as FormTypeMap[T][typeof formDataKey],
              field,
              index: ((formDataValue as string[]) || []).length,
              updateMode: UpdateMode.ARRAY_UPDATE,
            });
          }}
          options={optionSelectData}
          defaultOption="--- 未選択 ---"
          displayClearButton={true}
        />
      </>
    );
  }

  if (multi && fieldType === "input")
    return (
      <>
        {[
          ...(formDataValue && (formDataValue as string[]).length > 0
            ? (formDataValue as string[])
            : [""]), // 空配列なら1つだけ空の入力欄を出す
        ].map((item: string, index: number) => {
          return (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <InputField
                type={valueType}
                value={item}
                onChange={(value) =>
                  handleFormData({
                    key: formDataKey,
                    value: value as FormTypeMap[T][typeof formDataKey],
                    field,
                    index,
                  })
                }
                placeholder=""
              />

              <button
                type="button"
                onClick={() => {
                  handleFormData({
                    key: formDataKey,
                    value: undefined,
                    field,
                    updateMode: UpdateMode.ARRAY_UPDATE,
                    index: index,
                  });
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          );
        })}
      </>
    );

  if (fieldType === "select" && optionSelectData)
    return (
      <SelectField
        type={valueType}
        value={(formDataValue as string | number | Date) || ""}
        onChangeObj={(value: Record<string, any> | undefined) => {
          handleFormData({
            key: formDataKey,
            value: value as any,
            field,
            updateMode: UpdateMode.REPLACE,
          });
        }}
        options={optionSelectData}
        defaultOption="--- 未選択 ---"
        displayClearButton={true}
      />
    );

  if (fieldType === "input")
    return (
      <InputField
        type={valueType}
        value={formDataValue as string | number | Date}
        onChange={(value: string | number | Date | boolean | undefined) => {
          handleFormData({
            key: formDataKey,
            value: value as any,
            field,
            updateMode: UpdateMode.REPLACE,
          });
        }}
        placeholder=""
        supportButton={supportButton}
      />
    );
};

export const RenderField = <T extends keyof FormTypeMap>(
  props: RenderFieldProps<T>,
) => {
  return (
    <OptionProvider>
      <RenderFieldBase {...props} />
    </OptionProvider>
  );
};
