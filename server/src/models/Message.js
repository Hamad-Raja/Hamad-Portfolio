import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, maxlength: 120 },
    subject: { type: String, trim: true, maxlength: 120, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    ip: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
