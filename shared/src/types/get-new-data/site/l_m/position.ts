import { Scraped as ScrapedBase, Form as FormBase } from "../position";

export type Scraped = {
  home: ScrapedBase[];
  away: ScrapedBase[];
};
export type Form = {
  home: FormBase[];
  away: FormBase[];
};
