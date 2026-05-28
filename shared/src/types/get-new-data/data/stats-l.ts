import { Scraped as ScrapedBase, Form as FormBase } from "../models/stats-l";

export type Scraped = {
  home: ScrapedBase;
  away: ScrapedBase;
};
export type Form = {
  home: FormBase;
  away: FormBase;
};
