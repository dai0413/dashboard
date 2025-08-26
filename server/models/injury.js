const mongoose = require("mongoose");

const InjurySchema = new mongoose.Schema(
  {
    doa: {
      type: Date,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    team_name: {
      type: String,
    },
    now_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    doi: {
      type: Date,
    },
    dos: {
      type: Date,
    },
    injured_part: {
      type: [String],
      required: true,
    },
    is_injured: {
      type: Boolean,
      default: true,
    },
    ttp: {
      type: [String],
      validate: {
        validator: function (values) {
          if (!Array.isArray(values)) return false;
          return values.every((value) =>
            /^(\d+)([dwmy])$|^(\d+)([dwmy])-(\d+)([dwmy])$/i.test(value)
          );
        },
        message:
          "全治期間は 数字+単位（d/w/m/y）、または 数字+単位-数字+単位 の形式で入力してください（例: 3d, 10-14d, 1d-3w）",
      },
    },
    erd: {
      type: Date,
      validate: {
        validator: function (value) {
          return (
            !value ||
            (!this.doi && !this.dos) ||
            value > this.doi ||
            value > this.dos
          );
        },
        message: "erd (復帰予測日）は負傷日,手術日よりも後でなければなりません",
      },
    },
    URL: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

InjurySchema.pre("save", function (next) {
  if (Array.isArray(this.ttp) && this.ttp.length > 0 && !this.erd) {
    // 複数の期間がある場合、最大の復帰予測日を求める処理

    let maxDate = null;

    this.ttp.forEach((periodStr) => {
      let dateToAdd = new Date(this.doi || this.dos);

      // 単一期間のマッチ
      let ttpMatch = periodStr.match(/^(\d+)([dwmy])$/i);
      if (ttpMatch) {
        const period = parseInt(ttpMatch[1], 10);
        const unit = ttpMatch[2].toLowerCase();

        if (unit === "d") {
          dateToAdd.setDate(dateToAdd.getDate() + period);
        } else if (unit === "w") {
          dateToAdd.setDate(dateToAdd.getDate() + period * 7);
        } else if (unit === "m") {
          dateToAdd.setMonth(dateToAdd.getMonth() + period);
        } else if (unit === "y") {
          dateToAdd.setFullYear(dateToAdd.getFullYear() + period);
        }
      } else {
        // 範囲指定のマッチ
        let rangeMatch = periodStr.match(/^(\d+)-(\d+)([dwmy])$/i);
        if (rangeMatch) {
          const maxPeriod = parseInt(rangeMatch[2], 10);
          const unit = rangeMatch[3].toLowerCase();

          if (unit === "d") {
            dateToAdd.setDate(dateToAdd.getDate() + maxPeriod);
          } else if (unit === "w") {
            dateToAdd.setDate(dateToAdd.getDate() + maxPeriod * 7);
          } else if (unit === "m") {
            dateToAdd.setMonth(dateToAdd.getMonth() + maxPeriod);
          } else if (unit === "y") {
            dateToAdd.setFullYear(dateToAdd.getFullYear() + maxPeriod);
          }
        }
      }

      if (!maxDate || dateToAdd > maxDate) {
        maxDate = dateToAdd;
      }
    });

    if (maxDate) {
      this.erd = maxDate;
    }
  }

  next();
});

InjurySchema.index(
  {
    team: 1,
    team_name: 1,
    player: 1,
    doi: 1,
    dos: 1,
    injured_part: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Injury", InjurySchema);
