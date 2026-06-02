import { AxiosInstance } from "axios";
import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/referee-appearance";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/refereeAppearance";
import { GetDraftData } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { createItemBase } from "../../../api";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";

const KEYS = ["match", "referee"] as const;

const buildResolveInput = (draftData: Scraped[], match: Label) => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
    };
  });
  return data;
};

const fetchResolved = async (
  api: AxiosInstance,
  input: ResolveInput<{ referee: Select.MODEL }>[],
): Promise<ResolveOutput[]> => {
  const res = await createItemBase<{ refereeAppearance: ResolveOutput[] }>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { refereeAppearance: input },
    returnResponse: true,
  });

  if (!res.success) return [];

  return res.data.refereeAppearance;
};

const resolve = async (api: AxiosInstance, data: Scraped[], match: Label) => {
  const input = buildResolveInput(data, match);
  return fetchResolved(api, input);
};

export const getDraftData: GetDraftData<
  ModelType.REFEREE_APPEARANCE,
  true
> = async ({ api, draftData, postedDraftData, metaData }) => {
  if (!api) return { value: [], label: [] };

  const ids: string[] = metaData?.match;

  const updatedDraftData = await readDraftData({
    api,
    draftData,
    matchIds: ids,
    keys: ["match", "refereeAppearance"],
  });

  const updatedPostedDraftData = await readPostedDraftData({
    api,
    postedDraftData,
    matchIds: ids,
    keys: ["match"],
  });

  const results = await Promise.all(
    ids.map(async (id) => {
      const newDraftData = updatedDraftData[id];

      if (!newDraftData.refereeAppearance) return { value: [], label: [] };

      const posted = updatedPostedDraftData[id];

      if (!posted.match) return { value: [], label: [] };

      const { _id: matchId } = posted.match;

      const match = {
        id: matchId,
        label: posted.matchLabel || "",
      };

      const resolved = await resolve(
        api,
        newDraftData.refereeAppearance,
        match,
      );

      const result = buildValueLabel(resolved, KEYS);

      return { value: result.value, label: result.label };
    }),
  );

  return {
    value: results.flatMap((r) => r.value),
    label: results.flatMap((r) => r.label),
  };
};
