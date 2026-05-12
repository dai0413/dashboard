import { ControllerConfig } from "@dai0413/myorg-shared";
import z from "zod";
import { crudFactory } from "./crudFactory.js";
import { uploadFactory } from "./uploadFactory.js";

export const createController = <
  TData extends z.ZodObject<any>,
  TForm extends z.ZodObject<any>,
  TResponse extends z.ZodObject<any>,
  TPopulated extends z.ZodObject<any>,
>(
  config: ControllerConfig<TData, TForm, TResponse, TPopulated>,
) => {
  const crud = crudFactory(config);

  const upload = uploadFactory(config);
  return {
    ...crud,
    ...upload,
  };
};
