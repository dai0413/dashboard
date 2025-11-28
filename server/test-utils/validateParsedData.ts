const isDate = (v: unknown): v is Date => v instanceof Date;

export const validateParsedData = <T extends Record<string, any>>(
  parsedData: T | T[],
  expectedData: Partial<T> | Partial<T>[],
  populateKeys: string[]
) => {
  const checkValue = (value: any, expected: any, key: string) => {
    try {
      if (
        populateKeys.includes(key) &&
        typeof value === "object" &&
        "_id" in value
      ) {
        expect(value._id).toEqual(expected);
      } else if (isDate(value) && isDate(expected)) {
        if (value.getTime() === expected.getTime()) {
          expect(value.getTime()).toBe(expected.getTime());
        } else {
          const expectedTime = new Date(expected);
          expectedTime.setUTCHours(0, 0, 0, 0);
          expect(value.getTime()).toBe(expectedTime.getTime());
        }
      } else {
        expect(value).toEqual(expected);
      }
    } catch (err) {
      throw new Error(
        `Validation failed for key "${key}": ${(err as Error).message}`
      );
    }
  };

  if (Array.isArray(parsedData) && Array.isArray(expectedData)) {
    parsedData.forEach((item, i) => {
      Object.entries(item).forEach(([key, value]) => {
        const expected = expectedData[i][key as keyof T];
        if (expected !== undefined) {
          checkValue(value, expected, key);
        }
      });
    });
  } else if (!Array.isArray(parsedData) && !Array.isArray(expectedData)) {
    Object.entries(parsedData).forEach(([key, value]) => {
      const expected = expectedData[key as keyof T];
      if (expected !== undefined) {
        checkValue(value, expected, key);
      }
    });
  } else {
    throw new Error("parsedData と expectedData の形が一致しません");
  }
};
