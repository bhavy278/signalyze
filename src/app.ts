import express, { Application } from "express";

const app: Application = express();
const PORT: number = 5001;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Signalyze TypeScript API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
