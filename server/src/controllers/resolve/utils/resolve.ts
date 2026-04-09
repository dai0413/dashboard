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
        .select("_id name team")
        .lean<{ _id: any; name?: string; team?: string }[]>();

      if (findData.length === 1) {
        const { _id, name, team } = findData[0];

        result[field.key] = {
          id: _id,
          label: name ?? team ?? "",
        };

        if (field.delete) {
          delete result[field.delete];
        }
      } else {
        delete result[field.key];
      }
    }

    for (const field of removeFields) {
      delete result[field];
    }

    results.push(result);
  }

  return results;
};
