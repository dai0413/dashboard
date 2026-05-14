import { get } from "lodash";
import { useEffect, useState } from "react";
import {
  isCustomOptionType,
  isModelType,
  resolveOptionSource,
} from "../../../types/field";
import { FormTypeMap } from "../../../types/models";
import {
  getOptions,
  readOptions,
} from "../../../utils/createOption/createOption";
import { OptionsMap, OptionType } from "../../../utils/createOption/types/base";
import { OptionObj, OptionSource } from "../../../types/form/option";
import { FormFieldDefinition } from "../../../types/form/field";
import { getOptionKey } from "../../../lib/options";
import { OptionProvider } from "../../../context/options-provider";
import { HandleFormData } from "../../../types/form/handleFormData";
import { UpdateMode } from "../../../types/form";
import { TableFieldRenderer } from "./Field/renderers/TableFieldRenderer";
import { TextareaRenderer } from "./Field/renderers/TextareaRenderer";
import { SelectFieldRenderer } from "./Field/renderers/SelectFieldRenderer";
import { InputFieldRenderer } from "./Field/renderers/InputFieldRenderer";
import { api } from "../../../context/api-context";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { applyFilterClient } from "../../../utils/filter/applyFilterClient";
import { applySortClient } from "../../../utils/sort/applySortClient";
import { ModelOptionKey } from "../../../utils/createOption/types/optionTable";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FormFieldDefinition<T>;
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  handleFormData: HandleFormData<T>;
  supportButton?: boolean;
  options: Record<string, OptionObj<any>>;
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
  const [optionData, setOptionData] = useState<OptionObj<any>>({ data: [] });
  const [optionIsLoading, setOptionIsLoading] = useState<boolean>(false);
  const [optionSource, setOptionSource] = useState<OptionSource>(
    OptionSource.PRESET,
  );

  const [viewOptionData, setViewOptionData] = useState<OptionObj<any>>({
    data: [],
  });

  const handlePageChange = async (
    page: number,
    filterConditions?: FilterableFieldDefinition[],
    sortConditions?: SortableFieldDefinition[],
  ): Promise<void> => {
    setOptionIsLoading(true);

    if (!optionKey) return setOptionIsLoading(false);

    if (isModelType(optionKey)) {
      const optionTableData = await readOptions({
        api,
        key: optionKey,
        filterConditions,
        sortConditions,
        page,
      });
      if (!optionTableData) return setOptionIsLoading(false);
      setOptionData(optionTableData);
    } else if (isCustomOptionType(optionKey)) {
      if (!optionData) return setOptionIsLoading(false);

      let processed = [...optionData.data];

      processed = applyFilterClient(processed, filterConditions);
      processed = applySortClient(processed, sortConditions);

      const nextViewOptionData = {
        ...optionData,
        page,
        option: {
          ...optionData,
          data: processed,
        },
        totalCount: processed.length,
      };
      setViewOptionData(nextViewOptionData);
    }

    setOptionIsLoading(false);
  };

  useEffect(() => {
    if (!key) return;

    const nextOptionKey = getOptionKey(key);
    const source = resolveOptionSource(nextOptionKey);

    if (!source) return;
    setOptionKey(nextOptionKey);
    setOptionSource(source);

    if (source === OptionSource.PRESET) {
      getOptions({ source, key: nextOptionKey as OptionType }).then(
        setOptionData,
      );
    }

    if (source === OptionSource.REMOTE) {
      getOptions({
        source,
        key: nextOptionKey as ModelOptionKey,
        readOptionsParam: {
          api,
          filterConditions: [],
          sortConditions: [],
          page: 1,
        },
      }).then(setOptionData);
    }

    if (source === OptionSource.CUSTOM) {
      getOptions({
        source,
        key: nextOptionKey,
        options,
      }).then(setOptionData);
    }
  }, [key]);

  useEffect(() => {
    setViewOptionData(optionData);
  }, [optionKey, optionData]);

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
          viewOptionData={viewOptionData}
          optionIsLoading={optionIsLoading}
          optionSource={optionSource}
          handleFormData={handleFormData}
          handlePageChange={handlePageChange}
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
          options={optionData.data}
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
