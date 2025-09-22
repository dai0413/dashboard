const formatMatch = (matchDoc) => {
  const match =
    typeof matchDoc.toObject === "function" ? matchDoc.toObject() : matchDoc;

  const { stadium, stadium_name, ...rest } = match;

  return {
    ...rest,
    stadium: match.stadium ? match.stadium : { abbr: stadium_name },
  };
};

module.exports = { formatMatch };
