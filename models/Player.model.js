const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const PlayerSchema = new Schema(
  {
    profile_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
    number: number,
    position:{
         type: String, //lo queremos hacer enum? 
    },
    age: number,
    height: number,
    Nickname : String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Player = model("Player", playerSchema);

module.exports = Player;
