const positionToGroup = {
  GK: "GK",
  DF: "DF",
  CB: "DF",
  RCB: "DF",
  LCB: "DF",
  SB: "DF",
  RSB: "DF",
  LSB: "DF",
  WB: "DF",
  RWB: "DF",
  LWB: "DF",
  MF: "MF",
  CM: "MF",
  DM: "MF",
  OM: "MF",
  RSH: "MF",
  LSH: "MF",
  WG: "FW",
  RWG: "FW",
  LWG: "FW",
  CF: "FW",
  FW: "FW",
};

const addPositionGroup = {
  $addFields: {
    position_group: {
      $let: {
        vars: { map: positionToGroup },
        in: {
          $getField: {
            field: { $arrayElemAt: ["$position", 0] },
            input: "$$map",
          },
        },
      },
    },
  },
};

const position = {
  $addFields: {
    position_order: {
      $switch: {
        branches: [
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "GK"] },
            then: 1,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "DF"] },
            then: 2,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "CB"] },
            then: 3,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "RCB"] },
            then: 4,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "LCB"] },
            then: 5,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "SB"] },
            then: 6,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "RSB"] },
            then: 7,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "LSB"] },
            then: 8,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "WB"] },
            then: 9,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "RWB"] },
            then: 10,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "LWB"] },
            then: 11,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "MF"] },
            then: 12,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "CM"] },
            then: 13,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "RCM"] },
            then: 14,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "LCM"] },
            then: 15,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "DM"] },
            then: 16,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "OM"] },
            then: 17,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "RIH"] },
            then: 18,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "LIH"] },
            then: 19,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "SH"] },
            then: 20,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "RSH"] },
            then: 21,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "LSH"] },
            then: 22,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "FW"] },
            then: 23,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "WG"] },
            then: 24,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "RWG"] },
            then: 25,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "LWG"] },
            then: 26,
          },
          {
            case: { $eq: [{ $arrayElemAt: ["$position", 0] }, "CF"] },
            then: 27,
          },
        ],
        default: 999, // 不明値は最後
      },
    },
  },
};

module.exports = addPositionGroup;
