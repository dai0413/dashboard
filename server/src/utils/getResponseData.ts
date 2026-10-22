import z from "zod";
import { convertObjectIdToString } from "../controllers/helpers/crud/convertObjectIdToString.js";

type GetResponseData<
  TDataSchema extends z.ZodTypeAny,
  TFormSchema extends z.ZodTypeAny = TDataSchema,
  TResponseSchema extends z.ZodTypeAny = TDataSchema,
  TPopulatedSchema extends z.ZodTypeAny = TDataSchema,
> = {
  populated: unknown;
  SCHEMA: {
    DATA: TDataSchema;
    FORM: TFormSchema;
    POPULATED: TPopulatedSchema;
    RESPONSE: TResponseSchema;
  };
  convertFun?: (data: z.infer<TPopulatedSchema>) => z.infer<TResponseSchema>;
};

export const getResponseData = <
  TDataSchema extends z.ZodTypeAny,
  TFormSchema extends z.ZodTypeAny = TDataSchema,
  TResponseSchema extends z.ZodTypeAny = TDataSchema,
  TPopulatedSchema extends z.ZodTypeAny = TDataSchema,
>({
  populated,
  SCHEMA,
  convertFun,
}: GetResponseData<
  TDataSchema,
  TFormSchema,
  TResponseSchema,
  TPopulatedSchema
>): z.infer<TResponseSchema> => {
  const plain = convertObjectIdToString(populated);

  if (convertFun) {
    const parsed = SCHEMA.POPULATED.parse(plain);
    const convertedData = convertFun(parsed);
    const responseData = SCHEMA.RESPONSE.parse(convertedData);

    return responseData;
  } else {
    const responseData = SCHEMA.RESPONSE.parse(plain);

    return responseData;
  }
};
