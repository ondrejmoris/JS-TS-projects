/* eslint-disable import/prefer-default-export */
import express from "express";
import path from "path";
import methodOverride from "method-override";
import prisma from "./instances";
import { router as articlesRouter } from "./routes/articles";

const app = express();

async function main() {
  // ... you will write your Prisma Client queries here

  const allUsers = await prisma.article.findMany();

  console.log(allUsers);
}

main().catch((error) => console.log(error));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.render("articles/index", { articles });
});

app.use("/articles", articlesRouter);
app.listen(5000);
