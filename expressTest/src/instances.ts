import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (
    params.model === "Article" &&
    params.action !== "findUnique" &&
    params.action !== "findMany" &&
    params.action !== "findFirst" &&
    params.action !== "delete" &&
    params.action !== "deleteMany"
  ) {
    if (params.args.data.title) {
      // eslint-disable-next-line no-param-reassign
      params.args.data.slug = slugify(params.args.data.title, {
        lower: true,
        strict: true,
      });
    }
  }
  return next(params);
});

export default prisma;
