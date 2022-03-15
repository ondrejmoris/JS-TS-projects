import express from "express";
import path from "path";
import { router as articlesRouter } from "./routes/articles";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use("/articles", articlesRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(5000);
