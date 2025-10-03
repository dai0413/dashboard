import { FieldDefinition } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { useOptions } from "../../../context/options-provider";
import { Table } from "../../table";
import { InputField, SelectField } from "../../field";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get } from "lodash";

type RenderFieldProps<T extends keyof FormTypeMap> = {
  field: FieldDefinition<T>;
  formData: FormTypeMap[T];
  handleFormData: <K extends keyof FormTypeMap[T]>(
    key: K,
    value: FormTypeMap[T][K]
  ) => void;
};

export const RenderField = <T extends keyof FormTypeMap>({
  field,
  formData,
  handleFormData,
}: RenderFieldProps<T>) => {
  const { multi, key, fieldType, valueType } = field;
  const formDataKey = key as keyof FormTypeMap[T];
  const { getOptions, updateFilter, filters } = useOptions();

  const inputFieldOnChange = (value: string | number | Date | boolean) => {
    updateFilter(formDataKey as string, value as string);
  };

  const inputHandleFormData = (value: string | number | Date | boolean) => {
    handleFormData(formDataKey, value as any);
  };

  const multhInputHandleFormData = (
    index: number,
    value: string | number | Date | boolean
  ) => {
    const newValue = [...((formData[formDataKey] ?? []) as string[])];
    newValue[index] = value.toString();

    if (
      index === newValue.length - 1 &&
      value.toString().trim() !== "" &&
      !newValue.includes("")
    ) {
      newValue.push("");
    }

    handleFormData(formDataKey, newValue as FormTypeMap[T][typeof formDataKey]);
  };

  const filteredOptions = getOptions(field.key as string, false, true)?.filter(
    (option) =>
      !(
        (formData[formDataKey] as string[]) ??
        ([] as FormTypeMap[T][typeof formDataKey])
      ).includes(option.key)
  );

  const value = get(formData, formDataKey) as string | number | Date;
  const valueLabel = getOptions(formDataKey as string, false, false).find(
    (f) => f.key === value
  )?.key;

  const multiInputHandleFormData = (value: string | number | Date) => {
    const selected = value;
    if (selected) {
      const current = (formData[formDataKey] as string[]) ?? [];
      handleFormData(formDataKey, [
        ...current,
        selected,
      ] as FormTypeMap[T][typeof formDataKey]);
    }
  };

  if (fieldType === "table")
    return (
      <>
        <div className="mb-2 text-gray-700">
          選択中:{" "}
          {getOptions(key as string, false, false).find(
            (f) => f.key === formData[formDataKey]
          )?.label || "未選択"}
        </div>
        <div className="mb-4">
          <InputField
            type="text"
            value={filters[key as string]?.value || ""}
            onChange={inputFieldOnChange}
            placeholder="検索"
          />
        </div>
        <Table
          data={getOptions(key as string, true, true).data}
          headers={getOptions(key as string, true, true).header}
          form={true}
          onClick={(row) => {
            handleFormData(
              formDataKey,
              row.key as FormTypeMap[T][typeof formDataKey]
            );
          }}
          selectedKey={
            typeof formData[formDataKey] === "string"
              ? [formData[formDataKey]]
              : []
          }
          itemsPerPage={10}
        />
      </>
    );

  if (multi && fieldType === "textarea")
    return (
      <>
        {[
          ...(formData[formDataKey] &&
          (formData[formDataKey] as string[]).length > 0
            ? (formData[formDataKey] as string[])
            : [""]), // 空配列なら1つだけ空の入力欄を出す
        ].map((item: string, index: number) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={item}
              onChange={(e) => {
                const value = e.target.value;
                const newValue = [
                  ...((formData[formDataKey] ?? []) as string[]),
                ];
                newValue[index] = value;

                // 入力されたのが最後の要素かつ空だった場合、新たな空欄を追加
                if (
                  index === newValue.length - 1 &&
                  value.trim() !== "" &&
                  !newValue.includes("")
                ) {
                  newValue.push("");
                }

                handleFormData(
                  formDataKey,
                  newValue as FormTypeMap[T][typeof formDataKey]
                );
              }}
            />

            <button
              type="button"
              onClick={() => {
                const newValue = [...(formData[formDataKey] as string[])];
                newValue.splice(index, 1);
                handleFormData(
                  formDataKey,
                  newValue as FormTypeMap[T][typeof formDataKey]
                );
              }}
              className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </>
    );

  if (multi && fieldType === "select")
    return (
      <>
        {[...((formData[formDataKey] as string[]) ?? [])].map(
          (item: string, index: number) => {
            const inputArrayHandleFormData = (
              value: string | number | Date
            ) => {
              const newValue = [...(formData[formDataKey] as string[])];
              newValue[index] = String(value);
              handleFormData(
                formDataKey,
                newValue as FormTypeMap[T][typeof formDataKey]
              );
            };

            return (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <SelectField
                  type={valueType}
                  value={item}
                  onChange={inputArrayHandleFormData}
                  options={getOptions(key as string, false, true)}
                  defaultOption="--- 未選択 ---"
                />

                <button
                  type="button"
                  onClick={() => {
                    const newValue = [...(formData[formDataKey] as string[])];
                    newValue.splice(index, 1);
                    handleFormData(
                      formDataKey,
                      newValue as FormTypeMap[T][typeof formDataKey]
                    );
                  }}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            );
          }
        )}

        <SelectField
          type={valueType}
          value={""}
          onChange={multiInputHandleFormData}
          options={filteredOptions}
          defaultOption="--- 未選択 ---"
        />
      </>
    );

  if (multi && fieldType === "input")
    return (
      <>
        {[
          ...(formData[formDataKey] &&
          (formData[formDataKey] as string[]).length > 0
            ? (formData[formDataKey] as string[])
            : [""]), // 空配列なら1つだけ空の入力欄を出す
        ].map((item: string, index: number) => {
          const onChange = (value: string | number | Date | boolean) =>
            multhInputHandleFormData(index, value);

          return (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <InputField
                type={valueType}
                value={item}
                onChange={onChange}
                placeholder="検索"
              />

              <button
                type="button"
                onClick={() => {
                  const newValue = [...(formData[formDataKey] as string[])];
                  newValue.splice(index, 1);
                  handleFormData(
                    formDataKey,
                    newValue as FormTypeMap[T][typeof formDataKey]
                  );
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

  if (fieldType === "select")
    return (
      <SelectField
        type={valueType}
        value={valueLabel || ""}
        onChange={inputHandleFormData}
        options={getOptions(field.key as string, false, true)}
        defaultOption="--- 未選択 ---"
      />
    );

  if (fieldType === "input")
    return (
      <InputField
        type={valueType}
        value={value}
        onChange={inputHandleFormData}
        placeholder=""
      />
    );
};
