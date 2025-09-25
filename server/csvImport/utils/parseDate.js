const parseDate = (val) => {
  if (!val) return null;

  // "YYYY-MM-DD HH:mm" or "YYYY-MM-DDTHH:mm:ss"
  const parts = val.trim().replace("T", " ").split(/[- :]/);

  if (parts.length < 3) return null;

  const [year, month, day, hour = "0", minute = "0", second = "0"] = parts;

  // JS の Date コンストラクタは (year, monthIndex, day, hour, minute, second)
  // monthIndex は 0 始まりなので -1 する
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );

  return isNaN(date.getTime()) ? null : date;
};

module.exports = { parseDate };
