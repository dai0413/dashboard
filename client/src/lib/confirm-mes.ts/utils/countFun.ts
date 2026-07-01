type Data = Record<string, any>;

export const countFn = (d: Data[], key: string) => {
  return new Set(d.map((d) => d[key])).size;
};
