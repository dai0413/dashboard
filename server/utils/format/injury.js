const injury = (injuryDoc) => {
  const injury =
    typeof injuryDoc.toObject === "function" ? injuryDoc.toObject() : injuryDoc;

  const { team, team_name, ...rest } = injury;

  return {
    ...rest,
    team: injury.team ? injury.team : { abbr: team_name },
  };
};

export { injury };
