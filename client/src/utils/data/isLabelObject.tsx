export const isLabelObject = (
  obj: any
): obj is { label: string; id: string } => {
  return (
    typeof obj === "object" && obj !== null && "label" in obj && "id" in obj
  );
};
