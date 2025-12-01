import { periodLabel } from "@dai0413/myorg-shared";

const periodlabelOptions = periodLabel().map((p) => p.key);
type PeriodLabel = (typeof periodlabelOptions)[number];

export type MatchFormat = {
  _id: string;
  name: string;
  period: {
    period_label: PeriodLabel;
    start?: Number | null;
    end?: Number | null;
    order?: Number | null;
  }[];
};

type MatchFormatPost = Omit<MatchFormat, "_id"> & {};

export type MatchFormatForm = Partial<MatchFormatPost>;

export type MatchFormatGet = MatchFormat;
