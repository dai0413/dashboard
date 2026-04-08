import { ControllerConfig } from "@dai0413/myorg-shared";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";

import { UploadJob } from "../../../models/upload-job.js";
import { processUpload } from "./services/processUpload.js";
import { DecodedRequest } from "../../../types.js";

export const uploadItemHandler = async <
  TInput,
  TDoc,
  TData,
  TForm,
  TRes,
  TPopulated,
>(
  config: ControllerConfig<TDoc, TData, TForm, TRes, TPopulated>,
  req: DecodedRequest,
  res: Response,
) => {
  const job = await UploadJob.create({
    status: "pending",
  });

  res.status(StatusCodes.ACCEPTED).json({
    jobId: job._id,
    message: "アップロード処理を開始しました",
  });

  processUpload(job._id.toString(), config, req);
};
