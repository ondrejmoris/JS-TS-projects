import sharp from "sharp";
import chalk from "chalk";

export class ImgEditor {
  private img: sharp.Sharp;

  private width: number | undefined;

  private height: number | undefined;

  constructor() {
    this.img = sharp();
  }

  async init(path: string) {
    try {
      this.img = sharp(path);
      await this.img.stats();
      this.height = (await this.img.metadata()).height;
      this.width = (await this.img.metadata()).width;
    } catch (err) {
      throw new Error(chalk.red(err.message));
    }
  }

  async changeWidth(width: number) {
    try {
      if (width <= 0 || !width) {
        throw new Error(chalk.red("Width must be grather then 0!"));
      }
      await this.img.resize({ width, height: this.height });
      this.width = width;
    } catch (err) {
      throw new Error(chalk.red(err.message));
    }
  }

  async changeHeight(height: number) {
    try {
      if (height <= 0 || !height) {
        throw new Error(chalk.red("Height must be grather then 0!"));
      }
      await this.img.resize({ width: this.width, height });
      this.height = height;
    } catch (err) {
      throw new Error(chalk.red(err.message));
    }
  }

  async saveImg(type: sharp.AvailableFormatInfo) {
    try {
      this.img.toFormat(type).toFile(`./out.${type}`);
    } catch (err) {
      throw new Error(chalk.red(err.message));
    }
  }
}

export default ImgEditor;
