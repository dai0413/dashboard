import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { UploadJob } from "../models/upload-job.js";

const getItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await UploadJob.findById(id);

  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });
  }

  res.json(job);
};

export { getItem };
