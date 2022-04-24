/* eslint-disable import/prefer-default-export */
import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../instances";

export const router = express.Router();

function authenticateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  if (!accessToken) {
    // Send to frontend some message
    res.redirect("/");
  } else {
    try {
      const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
      req.body.user = user;
      console.log(user);
      next();
    } catch (err) {
      // Try to refresh token
      if (!refreshToken) {
        console.log("Dont have refresh token");
        res.send("Not authorized to do this!");
      } else {
        console.log("Trying to refresh token");
        res.redirect("/management/token");
      }
    }
  }
}

router.get("/new", authenticateToken, (req, res) => {
  res.render("articles/new", {
    article: { title: undefined, description: undefined, markdown: undefined },
  });
});

router.get("/edit/:id", authenticateToken, async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: Number.parseInt(req.params.id, 10) },
  });
  res.render("articles/edit", {
    article,
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
    sanitizedHtml: "",
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

router.delete("/:id", authenticateToken, async (req, res) => {
  await prisma.article.delete({
    where: { id: Number.parseInt(req.params.id, 10) },
  });
  res.redirect("/");
});

router.put("/:id", async (req, res) => {
  const articleForm = {
    title: req.body.title,
    description: req.body.description ? req.body.description : undefined,
    markdown: req.body.markdown ? req.body.markdown : undefined,
    slug: "",
    sanitizedHtml: "",
  };
  try {
    const articleDb = await prisma.article.update({
      where: {
        id: Number.parseInt(req.params.id, 10),
      },
      data: articleForm,
    });
    res.redirect(`/articles/${articleDb.slug}`);
  } catch (updateError) {
    res.render("articles/edit", { article: articleForm });
  }
});
