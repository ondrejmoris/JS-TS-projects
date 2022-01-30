import chalk from "chalk";
import { InputValidator } from "./InputValidator";
import { ImgEditor } from "./ImgEditor";

const iv = new InputValidator(process.argv.slice(2));

const ie = new ImgEditor();

async function editImg() {
  try {
    if ("width" in iv.Argv) {
      await ie.changeWidth(iv.Argv.width);
    }
    if ("height" in iv.Argv) {
      await ie.changeHeight(iv.Argv.height);
    }
    await ie.saveImg(iv.Argv.type);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

try {
  await ie.init(iv.Argv._[0]);
  await editImg();
  console.log(chalk.green("done"));
} catch (err) {
  console.log(err);
}
