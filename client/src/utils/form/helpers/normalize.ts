export const normalize = (val: any) =>
  val === "" || val === null ? undefined : val;
