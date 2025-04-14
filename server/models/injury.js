const mongoose = require("mongoose");

const InjurySchema = new mongoose.Schema({
  doa: {
    type: Date,
    required: true,
  },
  team: {
    type: mongoose.ObjectId,
    ref: "Team",
  },
  now_team: {
    type: mongoose.ObjectId,
    ref: "Team",
  },
  player: {
    type: mongoose.ObjectId,
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
    type: String,
    validate: {
      validator: function (value) {
        return /^(\d+)([dwmy])|(\d+)-(\d+)([dwmy])$/i.test(value);
      },
      message: "全治期間は 数字 + d/w/m/y の形式で入力してください",
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
});

InjurySchema.pre("save", function (next) {
  if (this.ttp && !this.erd) {
    const ttpMatch = this.ttp.match(/^(\d+)([dwmy])$/i);
    if (ttpMatch) {
      // ttp が単一の期間指定 (例: 1w, 10d)
      const period = parseInt(ttpMatch[1], 10);
      const unit = ttpMatch[2].toLowerCase();

      let dateToAdd = new Date(this.doi || this.dos);

      if (unit === "d") {
        dateToAdd.setDate(dateToAdd.getDate() + period);
      } else if (unit === "w") {
        dateToAdd.setDate(dateToAdd.getDate() + period * 7);
      } else if (unit === "m") {
        dateToAdd.setMonth(dateToAdd.getMonth() + period);
      } else if (unit === "y") {
        dateToAdd.setFullYear(dateToAdd.getFullYear() + period);
      }

      this.erd = dateToAdd; // 計算した復帰予測日を設定
    } else {
      const rangeMatch = this.ttp.match(/^(\d+)-(\d+)([dwmy])$/i);
      if (rangeMatch) {
        // ttp が範囲指定 (例: 1d-1w)
        const minPeriod = parseInt(rangeMatch[1], 10);
        const maxPeriod = parseInt(rangeMatch[2], 10);
        const unit = rangeMatch[3].toLowerCase();

        let dateToAdd = new Date(this.doi || this.dos);

        // 最大期間を使用して復帰予測日を計算
        if (unit === "d") {
          dateToAdd.setDate(dateToAdd.getDate() + maxPeriod);
        } else if (unit === "w") {
          dateToAdd.setDate(dateToAdd.getDate() + maxPeriod * 7);
        } else if (unit === "m") {
          dateToAdd.setMonth(dateToAdd.getMonth() + maxPeriod);
        } else if (unit === "y") {
          dateToAdd.setFullYear(dateToAdd.getFullYear() + maxPeriod);
        }

        this.erd = dateToAdd; // 計算した復帰予測日を設定
      }
    }
  }
  next();
});

module.exports = mongoose.model("Injury", InjurySchema);
