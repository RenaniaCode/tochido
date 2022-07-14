const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const matchSchema = new Schema(
  {
    teamLocal: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    scoreLocal: {
      type: Number,
      default: 0
    },
    teamVisitor: {
        type: Schema.Types.ObjectId,
        ref: "Team",
    },
    scoreVisitor: {
      type: Number,
      default: 0
    },
    _owner: {
      type: Schema.Types.ObjectId,
      ref: "League",
    },
    date: Date,
    hour: String,
    week: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Match = model("Match", matchSchema);

module.exports = Match;