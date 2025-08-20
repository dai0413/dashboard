import { FormTypeMap } from "../types/models";

export const cleanData = <T extends keyof FormTypeMap>(
  data: FormTypeMap[T] | FormTypeMap[T][]
) => {
  const cleaner = (data: FormTypeMap[T]): Partial<FormTypeMap[T]> => {
    const cleanedData: Partial<FormTypeMap[T]> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        cleanedData[key as keyof FormTypeMap[T]] = value.filter(
          (v) => v && v.trim() !== ""
        ) as FormTypeMap[T][keyof FormTypeMap[T]];
      } else {
        cleanedData[key as keyof FormTypeMap[T]] = value;
      }
    });

    return cleanedData;
  };

  if (Array.isArray(data)) {
    return data.map((d) => cleaner(d));
  }

  return cleaner(data);
};
