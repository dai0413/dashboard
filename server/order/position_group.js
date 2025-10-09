export const addPositionGroupOrder = {
  $addFields: {
    position_group_order: {
      $switch: {
        branches: [
          { case: { $eq: ["$position_group", "GK"] }, then: 1 },
          { case: { $eq: ["$position_group", "DF"] }, then: 2 },
          { case: { $eq: ["$position_group", "MF"] }, then: 3 },
          { case: { $eq: ["$position_group", "MF/FW"] }, then: 4 },
          { case: { $eq: ["$position_group", "FW"] }, then: 5 },
          { case: { $eq: ["$position_group", "FP"] }, then: 6 },
        ],
        default: 999, // 不明値は最後
      },
    },
  },
};
