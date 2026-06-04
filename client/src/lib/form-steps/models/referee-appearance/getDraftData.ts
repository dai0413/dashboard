import { AxiosInstance } from "axios";
import { Label, Select } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/referee-appearance";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/refereeAppearance";
import { DraftData, PostedDraftData } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { fetchResolved } from "../../utils/resolver/fetchResolved";
import { From } from "../../../../types/types";

const KEYS = ["match", "referee"] as const;

type Input = ResolveInput<{ referee: Select.MODEL }>;

const buildResolveInput = (draftData: Scraped[], match: Label) => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
    };
  });
  return data;
};

const resolve = async (api: AxiosInstance, data: Scraped[], match: Label) => {
  const input = buildResolveInput(data, match);
  return fetchResolved<"refereeAppearance", Input, ResolveOutput>(
    api,
    "refereeAppearance",
    input,
  );
};

type GetDraftDataParams = {
  api: AxiosInstance;
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  identifiers: string[];
  from: From.D_M | From.J_M;
};

export const getDraftData = async ({
  api,
  draftData,
  postedDraftData,
  identifiers,
  from,
}: GetDraftDataParams): Promise<{
  value: FormTypeMap[ModelType.REFEREE_APPEARANCE][];
  label: Record<string, any>[];
} | null> => {
  const updatedDraftData = await readDraftData({
    api,
    draftData,
    identifiers,
    readDraftDataKey: ["match", "refereeAppearance"],
    from,
  });

  const updatedPostedDraftData = await readPostedDraftData({
    api,
    postedDraftData,
    identifiers,
    readPostedDraftDataKey: ["match"],
  });

  const results = await Promise.all(
    identifiers.map(async (identifier) => {
      const newDraftData = updatedDraftData[identifier];

      if (!newDraftData.refereeAppearance) return { value: [], label: [] };

      const posted = updatedPostedDraftData[identifier];

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
