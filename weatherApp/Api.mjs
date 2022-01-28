import chalk from "chalk";

export class Api {
  #apiKey;
  #apiAdd;

  constructor(apiKey, apiAdd) {
    this.#apiAdd = apiAdd;
    this.#apiKey = "key=" + apiKey;
  }

  createCurrentLink(place) {
    return this.#apiAdd + "current.json?" + this.#apiKey + "&q=" + place;
  }

  createHistoryLink(place, date) {
    return (
      this.#apiAdd +
      "history.json?" +
      this.#apiKey +
      "&q=" +
      place +
      "&dt=" +
      date
    );
  }

  parseRespone(respone, statusCode) {
    if (statusCode == "200") {
      console.log();
      console.log(
        chalk.red(
          "Today weather in " +
            respone.location.name +
            ", " +
            respone.location.country
        )
      );
      console.log(chalk.gray("Last update: " + respone.current.last_updated));
      console.log(
        chalk.yellow("Temperature(celsius): " + respone.current.temp_c)
      );
      console.log(chalk.yellow("Condition: " + respone.current.condition.text));
      console.log(
        chalk.yellow("Wind speed(km/h): " + respone.current.wind_kph)
      );
      console.log(
        chalk.red("I dont want to waste my time with console.logs!!")
      );
      console.log();
      console.log(chalk.red("Bye, bye!"));
    } else {
      console.log(chalk.red("Error code: " + respone.error.code));
      console.log(
        chalk.red(chalk.red("Error description: " + respone.error.message))
      );
    }
  }
}

export default Api;
