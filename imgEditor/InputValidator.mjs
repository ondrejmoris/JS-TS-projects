import yargs from "yargs";
import chalk from "chalk";

export class InputValidator{
    #argv;

    constructor(argv){
        this.#createValidator(argv);
    }

    #createValidator(argv){
        this.#argv = yargs(argv)
        .usage(chalk.yellow('Usage: $0 <command> [options]'))
        .command(chalk.yellow('path'), 'Path to source image')
        .demandCommand(1, 1, chalk.red('Error: \n Enter path to source image!'))
        .example(chalk.yellow("$0 path -t avif"), 'convert image to .avif')

        .option('t', {
            alias: 'type',
            demandOption: true,
            describe: 'Type of output file',
            nargs: 1,
        })

        .option('w', {
            alias: 'width',
            demandOption: false,
            describe: 'Width of ouput file',
            nargs: 1,
            type: 'number'
        })

        .option('H', {
            alias: 'height',
            demandOption: false,
            describe: 'Height of ouput file',
            nargs: 1,
            type: 'number'
        })

        .help('h')
        .alias('h', 'help')
        .argv;
    }

    get argv(){
        return this.#argv;
    }
}

export default InputValidator;