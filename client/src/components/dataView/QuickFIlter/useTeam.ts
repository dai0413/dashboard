import { fieldDefinition } from "../../../lib/model-fields";
import { isFilterable } from "../../../types/field";
import { TeamCompetitionSeason } from "../../../types/models/team-competition-season";
import { readItemsBase } from "../../../lib/api";
import { api } from "../../../context/api-context";
import { convert } from "../../../lib/convert/DBtoGetted";
import {
  ageGroup,
  API_PATHS,
  FilterableFieldDefinition,
} from "@dai0413/myorg-shared";
import { ModelType } from "../../../types/models";
import { useEffect, useState } from "react";
import { useListView } from "../../../context/listView-context";
import { QuickFilterItem } from "../../../types/table";
import { Season } from "../../../types/models/season";
import { ViewMode } from "../../../types/types";

const j1 = import.meta.env.VITE_J1_ID;
const j2 = import.meta.env.VITE_J2_ID;
const j3 = import.meta.env.VITE_J3_ID;

type Competition = "j1" | "j2" | "j3";

const getCompetitionId = (competition: Competition): string | null => {
  if (competition === "j1") return j1;
  if (competition === "j2") return j2;
  if (competition === "j3") return j3;
  return null;
};

export const useTeam = (): {
  items: QuickFilterItem[];
  loading: boolean;
} => {
  const { setViewMode, setItemsPerPage } = useListView();
  const [items, setItems] = useState<QuickFilterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const competitionOnClick = async (
    competition: Competition,
  ): Promise<FilterableFieldDefinition[] | undefined> => {
    const competitionId = getCompetitionId(competition);
    if (!competitionId) {
      console.error("competition setting error ");
      return undefined;
    }
    const seasonObj = await readItemsBase<Season[]>({
      apiInstance: api,
      params: { competition: competitionId, current: true },
      backendRoute: API_PATHS.SEASON.ROOT,
    });
    if (!seasonObj) return undefined;

    const teamCompetitionSeasonObj = await readItemsBase<
      TeamCompetitionSeason[]
    >({
      apiInstance: api,
      params: { getAll: true, season: seasonObj.data[0]._id },
      backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
    });

    if (!teamCompetitionSeasonObj) return undefined;

    const teamCompetitionSeason = convert(
      ModelType.TEAM_COMPETITION_SEASON,
      teamCompetitionSeasonObj.data,
    );

    const teams = teamCompetitionSeason.map((t) => t.team);
    const filterCondition: FilterableFieldDefinition[] = [
      {
        key: "_id",
        label: "チーム",
        operator: "equals",
        type: "select",
        value: teams.map((t) => t.id).filter((id): id is string => Boolean(id)),
        valueLabel: teams.map((t) => t.label),
      },
    ];

    return filterCondition;
  };

  const ageGroupOnClick = async (
    ageGroupKey: string,
  ): Promise<FilterableFieldDefinition[] | undefined> => {
    const obj = ageGroup().find((a) => a.key === ageGroupKey);

    const defaultFieldObj = fieldDefinition[ModelType.TEAM]
      ?.filter(isFilterable)
      .find((f) => f.key === "age_group");

    if (!obj || !defaultFieldObj) return undefined;

    const filterCondition = [
      {
        ...defaultFieldObj,
        value: [obj.key],
        valueLabel: [obj.label],
        operator: "equals",
      },
    ];

    return filterCondition;
  };

  useEffect(() => {
    const init = async () => {
      const items: QuickFilterItem[] = [
        {
          key: "j1",
          label: "j1",
          onClick: async () => {
            setItemsPerPage(20);
            setViewMode(ViewMode.TILE);
          },
          filterCondition: await competitionOnClick("j1"),
          removeKey: ["age_group"],
        },
        {
          key: "j2",
          label: "j2",
          onClick: async () => {
            setItemsPerPage(20);
            setViewMode(ViewMode.TILE);
          },
          filterCondition: await competitionOnClick("j2"),
          removeKey: ["age_group"],
        },
        {
          key: "j3",
          label: "j3",
          onClick: async () => {
            setItemsPerPage(20);
            setViewMode(ViewMode.TILE);
          },
          filterCondition: await competitionOnClick("j3"),
          removeKey: ["age_group"],
        },
        {
          key: "high_school",
          label: "高校",
          onClick: async () => {
            setItemsPerPage(20);
            setViewMode(ViewMode.TILE);
          },
          filterCondition: await ageGroupOnClick("high_school"),
          removeKey: ["_id"],
        },
        {
          key: "youth",
          label: "ユース",
          onClick: async () => {
            setItemsPerPage(20);
            setViewMode(ViewMode.TILE);
          },
          filterCondition: await ageGroupOnClick("youth"),
          removeKey: ["_id"],
        },
        {
          key: "university",
          label: "大学",
          onClick: async () => {
            setItemsPerPage(20);
            setViewMode(ViewMode.TILE);
          },
          filterCondition: await ageGroupOnClick("university"),
          removeKey: ["_id"],
        },
      ];

      setItems(items);
      setLoading(false);
    };

    init();
  }, []);

  return { items, loading };
};
