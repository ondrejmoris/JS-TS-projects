/* eslint-disable import/prefer-default-export */
import express from "express";
import bcrypt from "bcrypt";
import prisma from "../instances";

export const router = express.Router();

router.get("/login", (req, res) => {
  res.render("management/login", { message: null });
});

router.post("/login", async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email: req.body.email },
    });
    if (user == null) {
      res.render("management/login", {
        message: "User not exists!",
      });
    }
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      res.redirect("/");
    }
    res.render("management/login", {
      message: "Wrong password!!",
    });
  } catch {
    res.render("management/login", {
      message: "Error while login",
    });
  }
});

router.get("/register", (req, res) => {
  res.render("management/register", { message: null });
});

router.post("/register", async (req, res) => {
  try {
    let user = await prisma.users.findUnique({
      where: { email: req.body.email },
    });
    if (user) {
      res.render("management/register", {
        message: "User already exists!",
      });
    }
    user = await prisma.users.create({
      data: {
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
      },
    });
    res.redirect("/");
  } catch (error) {
    res.render("management/register", {
      message: "Error while registration",
    });
  }
});
