const parseDate = (val) => {
  if (!val) return null;
  const date = new Date(val);
  return isNaN(date) ? null : date;
};

module.exports = { parseDate };
