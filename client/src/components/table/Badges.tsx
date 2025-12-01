import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable } from "../../types/field";
import { TeamCompetitionSeason } from "../../types/models/team-competition-season";
import { readItemsBase } from "../../lib/api";
import { useApi } from "../../context/api-context";
import { convert } from "../../lib/convert/DBtoGetted";
import {
  ageGroup,
  API_PATHS,
  FilterableFieldDefinition,
} from "@dai0413/myorg-shared";
import { objectIsEqual } from "../../utils";
import { useFilter } from "../../context/filter-context";
import { ModelType } from "../../types/models";
import { useState } from "react";

const j1 = import.meta.env.VITE_J1_ID;
const j2 = import.meta.env.VITE_J2_ID;
const j3 = import.meta.env.VITE_J3_ID;
const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

type Competition = "j1" | "j2" | "j3";
type AgeGroup = "high_school" | "youth" | "university";

const getCompetitionId = (competition: Competition): string | null => {
  if (competition === "j1") return j1;
  if (competition === "j2") return j2;
  if (competition === "j3") return j3;
  return null;
};

type BadgesProps = {
  handleUpdateTrigger?: () => void;
};

const Badges = ({ handleUpdateTrigger }: BadgesProps) => {
  const { filterConditions, setFilterConditions } = useFilter();

  const countryField = fieldDefinition[ModelType.TEAM]
    .filter(isFilterable)
    .find((f) => f.key === "country");

  const handleOnClick = (
    fieldKey: string,
    filterCondition: FilterableFieldDefinition,
    removeKey?: string
  ): void => {
    if (!countryField) return;

    setFilterConditions((prev) => {
      const existing = prev.find((f) => f.key === fieldKey);

      // ① 同じ値がすでにある → 削除
      if (
        existing &&
        existing.value &&
        filterCondition.value &&
        objectIsEqual(existing.value, filterCondition.value)
      ) {
        return prev.filter(
          (f) => f.key !== fieldKey && f.key !== "country._id"
        );
      }

      // ② すでにあるが別の値 → 更新
      if (existing) {
        return prev.map((f) =>
          f.key === fieldKey
            ? {
                ...f,
                ...filterCondition,
              }
            : f
        );
      }

      // ③ 存在しない → 新規追加
      const newCondition = [
        ...prev.filter((p) => p.key !== removeKey && p.key !== "country._id"),
        filterCondition,
        {
          ...countryField,
          key: "country._id",
          value: [japan],
          valueLabel: ["日本"],
          operator: "equals",
        },
      ];

      return newCondition;
    });

    handleUpdateTrigger && handleUpdateTrigger();
  };

  const addColor = (key: string) => {
    const value = filterConditions.find((f) => f.key === "age_group")?.value;
    return value?.includes(key);
  };

  const [selectTab, setSelectTab] = useState<Competition | AgeGroup | null>(
    null
  );

  const api = useApi();

  const competitionOnClick = async (competition: Competition) => {
    const competitionId = getCompetitionId(competition);
    if (!competitionId) return console.error("competition setting error ");
    const season = await readItemsBase({
      apiInstance: api,
      params: { competition: competitionId, current: true },
      backendRoute: API_PATHS.SEASON.ROOT,
      returnResponse: true,
    });
    if (!season) return;

    const resBody = await readItemsBase({
      apiInstance: api,
      params: { getAll: true, season: season.data[0]._id },
      backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
      returnResponse: true,
    });

    if (!resBody) return;

    const teamCompetitionSeason = convert(
      ModelType.TEAM_COMPETITION_SEASON,
      resBody.data as TeamCompetitionSeason[]
    );

    const teams = teamCompetitionSeason.map((t) => t.team);
    const filterCondition: FilterableFieldDefinition = {
      key: "_id",
      label: "チーム",
      operator: "equals",
      type: "select",
      value: teams.map((t) => t.id).filter((id): id is string => Boolean(id)),
      valueLabel: teams.map((t) => t.label),
    };

    handleOnClick("_id", filterCondition, "age_group");
  };

  const ageGroupOnClick = (ageGroupKey: string) => {
    const obj = ageGroup().find((a) => a.key === ageGroupKey);

    const defaultFieldObj = fieldDefinition[ModelType.TEAM]
      .filter(isFilterable)
      .find((f) => f.key === "age_group");

    if (!obj || !defaultFieldObj) return;

    handleOnClick(
      "age_group",
      {
        ...defaultFieldObj,
        value: [obj.key],
        valueLabel: [obj.label],
        operator: "equals",
      },
      "_id"
    );
  };

  const competitionTabs: {
    key: Competition | AgeGroup;
    label: string;
    onClick: (() => void) | (() => Promise<void>);
    onMark: boolean;
  }[] = [
    {
      key: "j1",
      label: "j1",
      onClick: () => {
        competitionOnClick("j1");
        setSelectTab("j1");
      },
      onMark: selectTab === "j1",
    },
    {
      key: "j2",
      label: "j2",
      onClick: () => {
        competitionOnClick("j2");
        setSelectTab("j2");
      },
      onMark: selectTab === "j2",
    },
    {
      key: "j3",
      label: "j3",
      onClick: () => {
        competitionOnClick("j3");
        setSelectTab("j3");
      },
      onMark: selectTab === "j3",
    },
    {
      key: "high_school",
      label: "高校",
      onClick: () => {
        ageGroupOnClick("high_school");
        setSelectTab("high_school");
      },
      onMark: !!addColor("high_school"),
    },
    {
      key: "youth",
      label: "ユース",
      onClick: () => {
        ageGroupOnClick("youth");
        setSelectTab("youth");
      },
      onMark: !!addColor("youth"),
    },
    {
      key: "university",
      label: "大学",
      onClick: () => {
        ageGroupOnClick("university");
        setSelectTab("university");
      },
      onMark: !!addColor("university"),
    },
  ];

  return (
    <div className="flex items-center gap-x-1">
      {competitionTabs.map((tab) => {
        return (
          <button
            key={tab.key}
            onClick={() => {
              setSelectTab((prev) => (prev === tab.key ? null : tab.key));
              tab.onClick();
            }}
            className={`cursor-pointer flex items-center p-1 border rounded-md ${
              tab.onMark
                ? "bg-blue-500 text-white"
                : "border-gray-400 text-gray-700"
            }`}
          >
            <span>{tab.label.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Badges;
