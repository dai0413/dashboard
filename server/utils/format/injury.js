const injury = (injuryDoc) => {
  const injury = injuryDoc.toObject();

  const { team, team_name, ...rest } = injury;

  return {
    ...rest,
    team: injury.team ? injury.team : { abbr: team_name },
  };
};

module.exports = { injury };
