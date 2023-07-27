import mongoose from "mongoose";

const CheckUserSchema = new mongoose.Schema(
  {
    IPv4: {
      type: String,
    },
    city: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    countryName: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CheckPoint", CheckUserSchema);
