import BadRequestError from "../../../errors/bad-request.js";

export const buildUpdateObject = (parsed: Record<string, any>) => {
  // parsed を $set / $unset に分離する
  const setFields: Record<string, any> = {};
  const unsetFields: Record<string, "" | 1> = {};

  Object.entries(parsed).forEach(([key, val]) => {
    if (val === undefined) {
      // undefined はフィールドを削除したい意図
      unsetFields[key] = "";
    } else {
      setFields[key] = val;
    }
  });

  // 作成する更新オブジェクト
  const updateObj: any = {};
  if (Object.keys(setFields).length > 0) updateObj.$set = setFields;
  if (Object.keys(unsetFields).length > 0) updateObj.$unset = unsetFields;

  // もし updateObj が空ならエラー/何もしない
  if (Object.keys(updateObj).length === 0) {
    throw new BadRequestError("更新要素がありません。");
  }

  return updateObj;
};
