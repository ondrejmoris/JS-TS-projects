import chalk from "chalk";
import InputValidator from "./InputValidator.mjs"
import ImgEditor from "./ImgEditor.mjs";

const iv = new InputValidator(process.argv.slice(2));

const ie = new ImgEditor();

async function editImg(){
    try{
        if("width" in iv.argv){
            await ie.changeWidth(iv.argv.width);
        }
        if("height" in iv.argv){
            await ie.changeHeight(iv.argv.height);
        }
        await ie.saveImg(iv.argv.type);
    }catch(err){
        throw err;
    }
}

try{
    await ie.init(iv.argv._[0]);
    await editImg();
    console.log(chalk.green("done"));
}catch(err){
    console.log(err.message);
}
