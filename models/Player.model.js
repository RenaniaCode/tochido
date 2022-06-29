const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    profile_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
    number: number,
    position:{
         type: String, //lo queremos hacer enum? 
        required: true,
    },
    age:
    {
         type: number,
    },
    height: number,
    aka : String,
    country: {
     type: String, // lo hacemo enum? Ponemos países o estados? 
    },
    role: {
      type: String,
      enum: ["ADMIN", "COACH", "PLAYER"],
      default: "PLAYER",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Player = model("Player", playerSchema);

module.exports = Player;
