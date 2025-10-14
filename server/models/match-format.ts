import mongoose from "mongoose";

const PeriodSchema = new mongoose.Schema(
  {
    period_label: {
      type: String,
      required: true,
      enum: ["1H", "2H", "ET1", "ET2", "3H", "4H", "PK", "GB"],
    },
    start: {
      type: Number,
      default: null,
      validate: {
        validator: function (value: number) {
          // end が null の場合はチェック不要
          if (value == null || this.end == null) return true;
          return value <= this.end;
        },
        message: "start must be less than or equal to end",
      },
    },
    end: {
      type: Number,
      default: null,
      validate: {
        validator: function (value: number) {
          // start が null の場合はチェック不要
          if (value == null || this.start == null) return true;
          return this.start <= value;
        },
        message: "end must be greater than or equal to start",
      },
    },
    order: { type: Number, default: 0 },
  },
  { _id: false } // period単位で_idいらない
);

const MatchFormatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    period: [PeriodSchema],
  },
  {
    timestamps: true,
  }
);

export const MatchFormat = mongoose.model("MatchFormat", MatchFormatSchema);
