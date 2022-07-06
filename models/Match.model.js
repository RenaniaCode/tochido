const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const matchSchema = new Schema(
  {
    teamLocal: {
      _name: String,
      score: Number,
      _logo: String,
    },
    teamVisitor: {
        name: String,
        score: Number,
        _logo: String,
    },
    date: Date,
    hour: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Match = model("Match", matchSchema);

module.exports = Match;