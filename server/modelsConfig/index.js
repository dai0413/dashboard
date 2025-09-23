const competitionStage = require("./competition-stage");
const competition = require("./competition");
const country = require("./country");
const injury = require("./injury");
const matchFormat = require("./match-format");
const match = require("./match");
const nationalCallup = require("./national-callup");
const nationalMatchSeries = require("./national-match-series");
const player = require("./player");
const referee = require("./referee");
const season = require("./season");
const stadium = require("./stadium");
const team = require("./team");
const transfer = require("./transfer");
const teamCompetitionSeason = require("./team-competition-season");

module.exports = {
  competitionStage: competitionStage.config,
  competition: competition.config,
  country: country.config,
  injury: injury.config,
  matchFormat: matchFormat.config,
  match: match.config,
  nationalCallup: nationalCallup.config,
  nationalMatchSeries: nationalMatchSeries.config,
  player: player.config,
  referee: referee.config,
  season: season.config,
  stadium: stadium.config,
  team: team.config,
  transfer: transfer.config,
  teamCompetitionSeason: teamCompetitionSeason.config,
};
