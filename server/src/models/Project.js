import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 800 },
    tech: [{ type: String, trim: true }],
    imageUrl: { type: String, trim: true, default: "" },
    liveUrl: { type: String, trim: true, default: "" },
    githubUrl: { type: String, trim: true, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
