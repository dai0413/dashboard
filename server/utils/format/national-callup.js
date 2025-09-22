const nationalCallup = (nationalCallupDoc) => {
  const nationalCallup =
    typeof nationalCallupDoc.toObject === "function"
      ? nationalCallupDoc.toObject()
      : nationalCallupDoc;

  const { team, team_name, ...rest } = nationalCallup;

  return {
    ...rest,
    team: nationalCallup.team ? nationalCallup.team : { abbr: team_name },
  };
};

module.exports = { nationalCallup };
