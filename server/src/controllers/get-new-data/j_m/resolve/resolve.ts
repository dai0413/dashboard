import { ResolveField } from "../types.js";

export const resolve = async <Scraped, Form>(
  data: Scraped[],
  resolveFields: ResolveField<Scraped>[],
  removeFields: string[],
): Promise<Partial<Form>[]> => {
  const results: Partial<Form>[] = [];

  for (const item of data) {
    const result: any = { ...item };

    for (const field of resolveFields) {
      if (!result[field.key]) continue;

      const findObj = result[field.key];

      const findData = await field.model
        .find(findObj)
        .select("_id")
        .lean<{ _id: any }[]>();

      if (findData.length === 1) {
        result[field.key] = findData[0]._id;

        if (field.delete) {
          delete result[field.delete];
        }
      }
    }

    for (const field of removeFields) {
      delete result[field];
    }

    results.push(result);
  }

  return results;
};
