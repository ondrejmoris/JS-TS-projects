import prompt from "prompt";
import chalk from "chalk";
import { request } from "undici";
import Api from "./Api.mjs";
import * as patterns from "./Patterns.mjs";

const apiKey = "5cd9588018674ccbb86152003221601";
const apiAdd = "http://api.weatherapi.com/v1/";

const api = new Api(apiKey, apiAdd);

function welcome() {
  console.log();
  console.log(
    chalk.red(
      "---------------------------------------------------------------------------"
    )
  );
  console.log(chalk.green("Welcome in small console weather application!"));
  console.log(
    chalk.yellow(
      "This application is created by master of code named Ondřej Moris."
    )
  );
  console.log(chalk.green("Enjoy this app!"));
  console.log(
    chalk.red(
      "---------------------------------------------------------------------------"
    )
  );
  console.log();
}

prompt.start();
welcome();

console.log();
(x) => {
  console.log();
};

console.log(chalk.yellow("Enter location"));

prompt.get(patterns.citySchema, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(chalk.yellow("Enter c - current or h - history weather"));
    prompt.get(patterns.typeSchema, async (err, resu) => {
      if (err) {
        console.log(err);
      } else {
        if (resu.type === "h") {
          console.log(chalk.yellow("Enter date in YYYY-MM-DD"));
          prompt.get(patterns.dateSchema, async (err, dateRes) => {
            if (err) {
              console.log(err);
            } else {
              const historyRes = await request(
                api.createHistoryLink(result.city, dateRes.date)
              );
              api.parseRespone(
                await historyRes.body.json(),
                historyRes.statusCode
              );
            }
          });
        } else {
          const recentRes = await request(api.createCurrentLink(result.city));
          api.parseRespone(await recentRes.body.json(), recentRes.statusCode);
        }
      }
    });
  }
});
