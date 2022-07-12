const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const playerSchema = new Schema(
  {
    profile_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
    number: Number,
    position:{
         type: String, //lo queremos hacer enum? 
    },
    _owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    _teamOwner: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },
    age: Number,
    height: String,
    nickname : String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Player = model("Player", playerSchema);

module.exports = Player;
