import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 500,
      default: "",
    },
    address: {
      type: String,
      maxLength: 200,
      default: "",
    },
    city: {
      type: String,
      maxLength: 100,
      default: "",
    },
    postalCode: {
      type: String,
      match: /^[0-9]{5,10}$/,
      default: "",
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    orgType: {
      type: String,
      enum: ["Private", "Association", "Limited Company"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Organizer", organizerSchema);
