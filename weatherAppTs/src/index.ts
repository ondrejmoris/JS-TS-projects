import prompt from "prompt";
import chalk from "chalk";
import { request } from "undici";
import { Api } from "./Api";
import * as patterns from "./Patterns";

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

console.log(chalk.yellow("Enter location"));

prompt.get(patterns.citySchema, (errorCityName, result) => {
  if (errorCityName) {
    console.log(errorCityName);
  } else if (result) {
    console.log(chalk.yellow("Enter c - current or h - history weather"));
    prompt.get(patterns.typeSchema, async (errorType, resu) => {
      if (errorType) {
        console.log(errorType);
      } else if (resu) {
        if (resu.type === "h") {
          console.log(chalk.yellow("Enter date in YYYY-MM-DD"));
          prompt.get(patterns.dateSchema, async (errorDate, dateRes) => {
            if (errorDate) {
              console.log(errorDate);
            } else if (dateRes) {
              const historyRes = await request(
                api.createHistoryLink(
                  result.city.toString(),
                  dateRes.date.toString()
                )
              );
              Api.parseRespone(
                await historyRes.body.json(),
                historyRes.statusCode
              );
            }
          });
        } else if (resu.type === "c") {
          const recentRes = await request(
            api.createCurrentLink(result.city.toString())
          );
          Api.parseRespone(await recentRes.body.json(), recentRes.statusCode);
        }
      }
    });
  }
});
