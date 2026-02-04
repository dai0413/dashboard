export enum ParserKey {
  Number = "number",
  Boolean = "boolean",
  ObjectId = "objectId",
  Date = "date",
  DateToString = "date-to-string",
  DateToStringWithTime = "date-to-string-with-time",
}

export type FieldParser<T> = (
  value: unknown,
  fieldName?: string,
) => { ok: true; value: T | undefined } | { ok: false; error: string };
