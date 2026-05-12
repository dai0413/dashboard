import { ControllerConfig } from "@dai0413/myorg-shared";
import z from "zod";
import { DecodedRequest } from "../../types/types.js";
import { UploadJob } from "../../models/upload-job.js";
import { StatusCodes } from "http-status-codes";
import { processUpload } from "./helpers/upload/processUpload.js";
import { Response } from "express";

const uploadFactory = <
  TData extends z.ZodObject<any>,
  TForm extends z.ZodObject<any>,
  TResponse extends z.ZodObject<any>,
  TPopulated extends z.ZodObject<any>,
>(
  config: ControllerConfig<TData, TForm, TResponse, TPopulated>,
) => {
  const uploadItem = async (req: DecodedRequest, res: Response) => {
    const job = await UploadJob.create({
      status: "pending",
    });

    res.status(StatusCodes.ACCEPTED).json({
      jobId: job._id,
      message: "アップロード処理を開始しました",
    });

    processUpload(job._id.toString(), config, req);
  };

  return {
    uploadItem,
  };
};

export { uploadFactory };
