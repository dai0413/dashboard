export const downloadCsv = <T extends Record<string, any>>(
  filename: string,
  items: T[],
) => {
  if (!items.length) return false;

  const headers = Object.keys(items[0]);

  const csv = [
    headers.join(","),
    ...items.map((item) =>
      headers
        .map((key) => {
          const value = item[key];

          if (value == null) return "";

          if (typeof value === "object") {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }

          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  return true;
};
