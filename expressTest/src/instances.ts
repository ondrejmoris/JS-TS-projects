import { PrismaClient } from "@prisma/client";
import createDomPurify from "dompurify";
import slugify from "slugify";
import { JSDOM } from "jsdom";
import { marked } from "marked";

const { window } = new JSDOM("").window;

// @ts-ignore
const dompurify = createDomPurify(window);

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === "Article") {
    if (
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
      if (params.args.data.markdown) {
        // eslint-disable-next-line no-param-reassign
        params.args.data.sanitizedHtml = dompurify.sanitize(
          marked(params.args.data.markdown)
        );
      }
    }
  }

  return next(params);
});

export default prisma;
