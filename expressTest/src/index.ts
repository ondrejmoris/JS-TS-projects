/* eslint-disable import/prefer-default-export */
import express from "express";
import path from "path";
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
app.use("/articles", articlesRouter);

app.get("/", (req, res) => {
  const articless = [
    {
      title: "Article1",
      createdAt: new Date(),
      description: "This is test descrtipiton",
    },
    {
      title: "Article2",
      createdAt: new Date(),
      description: "This is test descrtipiton 2",
    },
  ];
  res.render("articles/index", { articles: articless });
});

app.listen(5000);
