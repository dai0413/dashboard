export type UploadConfig = {
  createValidRows: (rows: any[]) => Promise<(any & { error?: string })[]>;
};

export type FieldParser<T> = (
  value: unknown,
  fieldName: string,
) => { ok: true; value: T | undefined } | { ok: false; error: string };

export enum ParserKey {
  Number = "number",
  Boolean = "boolean",
  ObjectId = "objectId",
  Date = "date",
}
