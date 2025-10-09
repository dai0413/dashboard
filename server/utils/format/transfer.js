const transfer = (transferDoc) => {
  const transfer =
    typeof transferDoc.toObject === "function"
      ? transferDoc.toObject()
      : transferDoc;

  const { from_team_name, to_team_name, ...rest } = transfer;

  return {
    ...rest,
    from_team: transfer.from_team
      ? transfer.from_team
      : { abbr: from_team_name },
    to_team: transfer.to_team ? transfer.to_team : { abbr: to_team_name },
  };
};

export { transfer };
