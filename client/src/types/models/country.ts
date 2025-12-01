import {
  area,
  confederation,
  district,
  subConfederation,
} from "@dai0413/myorg-shared";

const areaOptions = area().map((a) => a.label);
const districtOptions = district().map((a) => a.label);
const confederationOptions = confederation().map((a) => a.label);
const subConfederationOptions = subConfederation().map((a) => a.label);
type Area = (typeof areaOptions)[number] | null;
type District = (typeof districtOptions)[number] | null;
type Confederation = (typeof confederationOptions)[number] | null;
type SubConfederation = (typeof subConfederationOptions)[number] | null;

export type Country = {
  _id: string;
  name: string;
  en_name: string | null;
  iso3: string | null;
  fifa_code: string | null;
  area: Area;
  district: District;
  confederation: Confederation;
  sub_confederation: SubConfederation;
  established_year: number | null;
  fifa_member_year: number | null;
  association_member_year: number | null;
  district_member_year: number | null;
};

type CountryPost = Omit<Country, "_id">;

export type CountryForm = Partial<CountryPost>;

export type CountryGet = Country;
