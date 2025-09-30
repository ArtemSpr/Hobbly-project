import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    description: {
      type: String,
      default: "",
      maxLength: 2000,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    maxCapacity: {
      type: Number,
      default: 0,
    },
    eventType: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    // website: {
    //   type: String,
    //   default: "",
    // },
    // ticketUrl: {
    //   type: String,
    //   default: "",
    // },
    imageUrl: {
      type: String,
      default: "",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
