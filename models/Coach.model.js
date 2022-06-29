const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const CoachSchema = new Schema(
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
    profile_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
    password: String,
    role: {
      type: String,
      enum: ["ADMIN", "COACH", "PLAYER"],
      default: "PLAYER",
    },

    //// datos del equipo, no del coach
    team_name: {
      type: String,
      required: true,
      unique: true,
    },
    team_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg",
    },
    country: {
      type: String, // lo hacemo enum? Ponemos países o estados?
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Coach = model("Coach", coachSchema);

module.exports = Coach;
