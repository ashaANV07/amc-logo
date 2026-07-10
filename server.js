import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const HOST = "0.0.0.0";

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS for all origins
app.use(cors());

// Serve static images from the current directory
app.use("/images", express.static(path.join(__dirname, "images")));

// Root route - list all available images
app.get("/", (req, res) => {
  const imagesDir = path.join(__dirname, "images");
  const files = fs.readdirSync(imagesDir).filter((f) =>
    /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f)
  );

  const imageList = files.map((f) => ({
    name: f,
    url: `http://localhost:${PORT}/images/${encodeURIComponent(f)}`,
  }));

  res.json({
    message: "AMC Logo Static Image Server",
    total: imageList.length,
    baseUrl: `http://localhost:${PORT}/images/`,
    images: imageList,
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", port: PORT });
});

app.listen(PORT, HOST, () => {
  console.log("===========================================");
  console.log(`  AMC Logo Server running on port ${PORT}`);
  console.log(`  Listening on : ${HOST}:${PORT}`);
  console.log(`  Base URL : http://localhost:${PORT}`);
  console.log(`  Images   : http://localhost:${PORT}/images/<filename>`);
  console.log(`  List     : http://localhost:${PORT}/`);
  console.log("===========================================");
});
