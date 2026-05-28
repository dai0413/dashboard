import {
  Scraped as ScrapedBase,
  Form as FormBase,
} from "../models/team-match-formation";

export type Scraped = {
  home: ScrapedBase;
  away: ScrapedBase;
};
export type Form = {
  home: FormBase;
  away: FormBase;
};
