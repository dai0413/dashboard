const isDate = (v: unknown): v is Date => v instanceof Date;

export const validateParsedData = <T extends Record<string, any>>(
  parsedData: T | T[],
  expectedData: Partial<T> | Partial<T>[],
  populateKeys: string[]
) => {
  if (Array.isArray(parsedData) && Array.isArray(expectedData)) {
    parsedData.forEach((item, i) => {
      Object.entries(item).forEach(([key, value]) => {
        const expected = expectedData[i][key as keyof T];
        if (expected !== undefined) {
          if (
            populateKeys.includes(key) &&
            typeof value === "object" &&
            "_id" in value
          ) {
            expect(value._id).toEqual(expected);
          } else if (isDate(value) && isDate(expected)) {
            expect(value.getTime()).toBe(expected.getTime());
          } else {
            expect(value).toEqual(expected);
          }
        }
      });
    });
  } else if (!Array.isArray(parsedData) && !Array.isArray(expectedData)) {
    Object.entries(parsedData).forEach(([key, value]) => {
      const expected = expectedData[key as keyof T];
      if (expected !== undefined) {
        if (
          populateKeys.includes(key) &&
          typeof value === "object" &&
          "_id" in value
        ) {
          expect(value._id).toEqual(expected);
        } else if (isDate(value) && isDate(expected)) {
          expect(value.getTime()).toBe(expected.getTime());
        } else {
          expect(value).toEqual(expected);
        }
      }
    });
  } else {
    throw new Error("parsedData と expectedData の形が一致しません");
  }
};
