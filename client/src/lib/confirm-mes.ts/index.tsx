import { ModelType } from "../../types/models";
import { JSX } from "react";
import { nationalCallup } from "./NationalCallup";
import { player } from "./Player";

// 特定のモデルの formDatas を受け取って JSX を返す関数型
type ConfirmRenderer = (
  formDatas: Record<string, string | number | undefined>[]
) => JSX.Element;

// confirmMes 全体の型
type ConfirmRendererMap = {
  [K in ModelType]?: ConfirmRenderer;
};

const confirmMes: ConfirmRendererMap = {
  [ModelType.NATIONAL_CALLUP]: nationalCallup,
  [ModelType.PLAYER]: player,
};

// モデルタイプを渡すと対応する関数を返す
export const getConfirmMes = <T extends ModelType>(
  modelType: T
): ConfirmRenderer => {
  return modelType in confirmMes
    ? (confirmMes[modelType] as ConfirmRenderer)
    : () => <></>;
};
