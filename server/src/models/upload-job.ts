import mongoose from "mongoose";

const uploadJobSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    total: { type: Number, default: 0 },
    processed: { type: Number, default: 0 },
    totalAdded: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    errorCsv: { type: String, default: null }, // base64保存
  },
  { timestamps: true },
);

export const UploadJob = mongoose.model("UploadJob", uploadJobSchema);
