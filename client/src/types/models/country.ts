import {
  AreaOptions,
  ConfederationOptions,
  DistrictOptions,
  SubConfederationOptions,
} from "../../context/options-provider";

type Area = (typeof AreaOptions)[number] | null;
type District = (typeof DistrictOptions)[number] | null;
type Confederation = (typeof ConfederationOptions)[number] | null;
type SubConfederation = (typeof SubConfederationOptions)[number] | null;

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
