import dotenv from "dotenv";
import mongoose from "mongoose";
import Project from "./models/Project.js";

dotenv.config();

const demo = [
  {
    title: "E-Commerce Store",
    description: "Full MERN e-commerce app with authentication, product management, cart, and checkout flow.",
    tech: ["React", "Node", "Express", "MongoDB", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=60",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    order: 1
  },
  {
    title: "Admin Dashboard",
    description: "Analytics-style dashboard with protected routes, CRUD modules, and reusable UI components.",
    tech: ["React", "Express", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=60",
    featured: true,
    order: 2
  },
  {
    title: "Portfolio Website",
    description: "Modern responsive portfolio with blue gradient theme, projects, and contact form connected to backend.",
    tech: ["React", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=60",
    featured: false,
    order: 3
  }
];

async function run() {
  if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI");
  await mongoose.connect(process.env.MONGO_URI);
  await Project.deleteMany({});
  await Project.insertMany(demo);
  console.log("✅ Seeded demo projects");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
