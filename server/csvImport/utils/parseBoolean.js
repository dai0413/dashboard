const parseBoolean = (val) => {
  if (val === undefined || val === null) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    return ["true", "1", "yes", "y"].includes(val.toLowerCase());
  }
  return Boolean(val);
};

module.exports = { parseBoolean };
