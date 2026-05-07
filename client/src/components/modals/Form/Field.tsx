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
import { TextareaRenderer } from "./Field/renderers/TextareaRenderer";
import { SelectFieldRenderer } from "./Field/renderers/SelectFieldRenderer";
import { InputFieldRenderer } from "./Field/renderers/InputFieldRenderer";

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

  const [optionSelectData, setOptionSelectData] = useState<OptionArray>([]);

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
          totalCount: optionData.data.length,
        });
      }
    }
  }, [key]);

  const withTrailingEmpty = (arr: string[] = [], lengthInArray?: number) => {
    if (lengthInArray && arr.length >= lengthInArray) {
      return arr; // 上限なら追加しない
    }

    if (arr.length === 0) return [""];

    return arr[arr.length - 1] === "" ? arr : [...arr, ""];
  };
  const formDataValue = get(formData, formDataKey);
  const formDataArray = multi
    ? withTrailingEmpty(formDataValue as string[])
    : [];

  switch (fieldType) {
    case "table": {
      const formDataLabel = get(formLabel, formDataKey) || "";
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
    }
    case "textarea": {
      const onChangeItem = (index: number, value: string | undefined) => {
        handleFormData({
          key: formDataKey,
          value: value as FormTypeMap[T][typeof formDataKey],
          field,
          index,
          updateMode: UpdateMode.ARRAY_UPDATE,
        });
      };

      return (
        <TextareaRenderer
          multi={multi}
          items={formDataArray}
          onChangeItem={onChangeItem}
        />
      );
    }
    case "select": {
      const onChangeItem = (
        index: number,
        value: string | number | Date | undefined,
      ) => {
        handleFormData({
          key: formDataKey,
          value: value as FormTypeMap[T][typeof formDataKey],
          field,
          index,
          updateMode: UpdateMode.ARRAY_UPDATE,
        });
      };

      const onChangeObj = (value: Record<string, any> | undefined) => {
        handleFormData({
          key: formDataKey,
          value: value as any,
          field,
          updateMode: UpdateMode.REPLACE,
        });
      };

      return (
        <SelectFieldRenderer
          multi={multi}
          uniqueInArray={uniqueInArray}
          lengthInArray={lengthInArray}
          value={(formDataValue as string | number | Date) ?? ""}
          values={formDataArray}
          options={optionSelectData}
          onChangeItem={onChangeItem}
          onChangeObj={onChangeObj}
        />
      );
    }
    case "input": {
      const onChange = (
        value: string | number | Date | boolean | undefined,
      ) => {
        handleFormData({
          key: formDataKey,
          value: value as FormTypeMap[T][typeof formDataKey],
          field,
          updateMode: UpdateMode.REPLACE,
        });
      };

      const onChangeItem = (
        index: number,
        value: string | number | Date | boolean | undefined,
      ) => {
        handleFormData({
          key: formDataKey,
          value: value as FormTypeMap[T][typeof formDataKey],
          field,
          index,
          updateMode: UpdateMode.ARRAY_UPDATE,
        });
      };

      return (
        <InputFieldRenderer
          multi={multi}
          supportButton={supportButton}
          type={valueType}
          value={formDataValue as string}
          values={formDataArray}
          onChange={onChange}
          onChangeItem={onChangeItem}
        />
      );
    }
  }
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
