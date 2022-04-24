/* eslint-disable import/prefer-default-export */
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RefreshTokens, Users } from "@prisma/client";
import prisma from "../instances";

export const router = express.Router();

function generateAccessToken(user: Users) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
}

function getExpiration(days = 7) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
}

function tokenExpired(token: RefreshTokens | null) {
  if (token === null) return true;
  if (token.expireAt < new Date()) return true;
  return false;
}

function alreadyLogged(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  if (accessToken) {
    try {
      const aToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
      console.log(aToken);
      console.log("Already logged in");
      // Send some message like "already logged in..."
      res.redirect("/");
    } catch (err) {
      next();
    }
  } else if (refreshToken) {
    console.log("Trying to refresh token");
    res.redirect("/management/token");
  } else {
    next();
  }
}

router.get("/token", async (req, res) => {
  const token = req.cookies.refresh_token;
  if (token === null) {
    // Send some message to frontend
    res.redirect("/");
  }
  try {
    const dbToken = await prisma.refreshTokens.findUnique({
      where: { refreshToken: token },
    });
    if (!dbToken || tokenExpired(dbToken)) {
      res.clearCookie("refresh_token");
      res.render("management/login", {
        message: "Please log in again",
      });
    } else {
      const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
      res
        .cookie("access_token", generateAccessToken(user as Users), {
          httpOnly: true,
          sameSite: "strict",
        })
        .redirect(req.header("Referer") || "/");
    }
  } catch (err) {
    // Send some error message... This catch error from db call or cant vertify refresh token
    res.redirect("/");
  }
});

router.get("/login", alreadyLogged, (req, res) => {
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
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET!
      );
      await prisma.refreshTokens.create({
        data: { refreshToken, usersId: user.id, expireAt: getExpiration() },
      });
      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .redirect("/");
    } else {
      res.render("management/login", {
        message: "Wrong password!!",
      });
    }
  } catch {
    res.render("management/login", {
      message: "Error while login",
    });
  }
});

router.get("/register", alreadyLogged, (req, res) => {
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

router.delete("/logout", async (req, res) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  if (!accessToken) {
    console.log("You are not logged in");
    res.redirect("/");
  } else {
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
      if (!refreshToken) {
        console.log("Not have refresh token");
        res.clearCookie("access_token").redirect("/");
      } else {
        try {
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
          try {
            await prisma.refreshTokens.delete({ where: { refreshToken } });
          } catch (dbError) {
            // Some db error
            console.log(dbError);
            res.redirect("/");
          }
          // Send some loggout message
          console.log("Successfully logged out");
          res
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .redirect("/");
        } catch (refreshTokenError) {
          console.log("Not have refresh token, but logged out");
          res
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .redirect("/");
        }
      }
    } catch (accessTokenError) {
      console.log("Bad access token");
      res.clearCookie("access_token").redirect("/");
    }
  }
});
