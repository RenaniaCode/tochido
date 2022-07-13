const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const warningSchema = new Schema(
  {
    header: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Warning = model("Warning", warningSchema);

module.exports = Warning;
