const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const leagueSchema = new Schema(
  {
    league_name: {
      type: String,
      unique: true,
    },
    league_logo: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
    country: {
      type: String, // lo hacemo enum? Ponemos países o estados?
    },
    _owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    teams: [{
      wins: {type : Number, min: 0, default:0},
      _team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
    },
      defeats: {type : Number, min: 0, default:0},
      points: {type : Number, min: 0, default:0}
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const League = model("League", leagueSchema);

module.exports = League;