/* eslint-disable import/prefer-default-export */
import express from "express";
import prisma from "../instances";

export const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", {
    article: { title: undefined, description: undefined, markdown: undefined },
  });
});

// router.get(":id", (req, res) => {});

router.post("/", async (req, res) => {
  const articleForm = {
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
  };
  try {
    console.log(req.body.title);
    console.log(typeof req.body.description);
    const articleDb = await prisma.article.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
      },
    });
    res.redirect(`/articles/${articleDb.id}`);
  } catch (createError) {
    res.render("articles/new", {
      article: articleForm,
    });
  }
});
