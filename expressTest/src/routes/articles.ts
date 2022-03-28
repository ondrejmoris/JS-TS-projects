/* eslint-disable import/prefer-default-export */
import express from "express";
import prisma from "../instances";

export const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", {
    article: { title: undefined, description: undefined, markdown: undefined },
  });
});

router.get("/:slug", async (req, res) => {
  const article = await prisma.article.findUnique({
    where: {
      slug: req.params.slug,
    },
  });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article });
});

router.post("/", async (req, res) => {
  const articleForm = {
    title: req.body.title,
    description: req.body.description ? req.body.description : undefined,
    markdown: req.body.markdown ? req.body.markdown : undefined,
    slug: "",
  };
  try {
    const articleDb = await prisma.article.create({
      data: articleForm,
    });
    res.redirect(`/articles/${articleDb.slug}`);
  } catch (createError) {
    res.render("articles/new", {
      article: articleForm,
    });
  }
});

router.delete("/:id", async (req, res) => {
  await prisma.article.delete({
    where: { id: Number.parseInt(req.params.id, 10) },
  });
  res.redirect("/");
});
