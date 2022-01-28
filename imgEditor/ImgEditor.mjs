import sharp from "sharp";
import chalk from "chalk";

export class ImgEditor{
    #img;
    #width;
    #height;

    constructor(){}

    async init(path){
        try{
            this.#img = sharp(path);
            await this.#img.stats();
            this.#height = (await this.#img.metadata()).height;
            this.#width = (await this.#img.metadata()).width;
        }catch(err){
            throw new Error(chalk.red(err.message));
        }
    }

    async changeWidth(width){
        try{
            if(width <= 0 || isNaN(width)){
                throw new Error(chalk.red("Width must be grather then 0!"));
            }
            await this.#img.resize({ width: width, height: this.#height });
            this.#width = width;
        }catch(err){
            throw new Error(chalk.red(err.message));
        }
    }

    async changeHeight(height){
        try{
            if(height <= 0 || isNaN(height)){
                throw new Error(chalk.red("Height must be grather then 0!"));
            }
            await this.#img.resize({ width: this.#width, height: height });
            this.#height = height;
        }catch(err){
            throw new Error(chalk.red(err.message));
        }
    }

    async saveImg(type){
        try{
            this.#img.toFormat(type).toFile("./out."+ type);
        }catch(err){
            throw new Error(chalk.red(err.message));
        }
    }
}

export default ImgEditor;