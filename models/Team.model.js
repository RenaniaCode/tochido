const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const teamSchema = new Schema(
  {
    team_name: {
      type: String,
      unique: true,
    },
    team_logo: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
    _owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    _players: [{
      type: Schema.Types.ObjectId,
      ref: "Player"
    }],
    _leagueOwner: {
      type: Schema.Types.ObjectId,
      ref: "League"
    },
    wins:{
      type: Number,
      default: 0
    },
    defeats:{
      type: Number,
      default: 0
    },
    draws:{
      type: Number,
      default: 0
    },
    gamesPlayed:{
      type: Number,
      default: 0
    },
    points:{
      type: Number,
      default: 0
    },
    playbook: [String],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Team = model("Team", teamSchema);

module.exports = Team;