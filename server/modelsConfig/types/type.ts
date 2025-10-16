import mongoose from "mongoose";
import z from "zod";

export type PopulatePath = {
  path: string;
  collection?: string;
};

export interface ControllerConfig<
  TDoc,
  TData,
  TForm = TData,
  TResponse = TData
> {
  name: string;
  SCHEMA: {
    DATA: z.ZodType<TData>;
    FORM: z.ZodType<TForm>;
    RESPONSE: z.ZodType<TResponse>;
  };
  TYPE: TData;
  MONGO_MODEL: mongoose.Model<TDoc>;
  POPULATE_PATHS: PopulatePath[];
  getALL?: {
    query?: {
      field: string;
      type: "ObjectId" | "String" | "Number" | "Date";
    }[];
    sort?: Record<string, number>;
  };
  bulk?: boolean;
  download?: boolean;
  TEST: {
    sampleData: TForm[];
    updatedData: Partial<TForm>;
    testDataPath?: string;
  };
}
