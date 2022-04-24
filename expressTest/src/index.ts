/* eslint-disable import/prefer-default-export */
import express from "express";
import path from "path";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import prisma from "./instances";
import { router as articlesRouter } from "./routes/articles";
import { router as managementRouter } from "./routes/management";

const app = express();

async function main() {
  // ... you will write your Prisma Client queries here

  const allArticles = await prisma.article.findMany();
  const allUsers = await prisma.users.findMany();
  const allRefreshTokens = await prisma.refreshTokens.findMany();

  console.log(allArticles);
  console.log(allUsers);
  console.log(allRefreshTokens);
}

main().catch((error) => console.log(error));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.get("/", async (req, res) => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.render("articles/index", { articles });
});

app.use("/management", managementRouter);
app.use("/articles", articlesRouter);

app.listen(5000);
