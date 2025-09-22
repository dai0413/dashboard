const { transfer } = require("./transfer");
const { match } = require("./match");
const { injury } = require("./injury");
const { nationalCallup } = require("./national-callup");

module.exports = {
  formatTransfer: transfer,
  formatMatch: match,
  formatInjury: injury,
  formatNationalCallup: nationalCallup,
};
