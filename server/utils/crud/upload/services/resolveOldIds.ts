type OldIdResolver<T> = {
  key: keyof T; // 変換後に入れるキー (match, team, player)
  oldKey: keyof T; // old_id のキー
  model: {
    find: Function;
  };
};

export async function resolveOldIds<TInput>(
  rows: (TInput & { error?: string })[],
  resolvers: OldIdResolver<TInput & { error?: string }>[],
): Promise<(TInput & { error?: string })[]> {
  const result = [...rows];

  for (const { key, oldKey, model } of resolvers) {
    // old_id を全部集める
    const oldIds = result
      .map((r) => r[oldKey])
      .filter((v) => typeof v === "string") as string[];

    if (oldIds.length === 0) continue;

    const docs = await model.find({ old_id: { $in: oldIds } });

    const map = Object.fromEntries(
      docs.map((d: any) => [d.old_id, d._id.toString()]),
    );

    // rows に反映
    for (const row of result) {
      if (row[key]) continue; // すでにあるならOK

      if (row[oldKey] && !map[row[oldKey] as string]) {
        row.error ??= "";
        row.error += `${String(oldKey)} が見つかりません; `;
        continue;
      }

      if (row[oldKey] && map[row[oldKey] as string]) {
        row[key] = map[row[oldKey] as string];
      }
    }
  }

  return result;
}
