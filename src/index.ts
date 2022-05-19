import axios from 'axios';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import chalk from 'chalk';

dotenv.config();
const API_KEY = process.env.API_KEY;

//list of input questions for CLI with included validation
const questions: [object, object, object] = [
    {
        type: 'input',
        name: 'currencyOne',
        message: "What currency you'd like to convert (ex. BTC)?",
        filter(val: String) {
            return val.toUpperCase();
        },
        validate(val: String) {
            const pass = val.length == 3 ? true : false;
            if (pass) {
                return true;
            }

            return 'Please enter a valid currency data (example: BTC, ETH...)';
        },
    },
    {
        type: 'input',
        name: 'currencyTwo',
        message: "What currency would you like to have (ex. USD)?",
        filter(val: String) {
            return val.toUpperCase();
        },
        validate(val: String) {
            const pass = val.length == 3 ? true : false;
            if (pass) {
                return true;
            }

            return 'Please enter a valid currency data (example: USD, RUB...)';
        },
    },
    {
        type: 'input',
        name: 'amount',
        message: "Please, enter the amount of money, would you like to convert (ex. 1)",
        validate(value: any) {
            const valid = !isNaN((value));
            return valid || 'Please enter a number';
        },
    },
];

(async (): Promise<void> => {
    inquirer.prompt(questions).then((answers) => {
        const headers: any = {
            'X-CMC_PRO_API_KEY': API_KEY
        };

        const params: object = {
            amount: answers.amount,
            symbol: answers.currencyOne,
            convert: answers.currencyTwo,
        };

        let response = null;
        new Promise(async (resolve, reject) => {
            try {
                response = await axios.get('https://pro-api.coinmarketcap.com/v1/tools/price-conversion', {
                    headers,
                    params,
                });
            } catch (err) {
                response = null;
                // error
                console.log(err);
                reject(err);
            }

            if (response) {
                // success
                const json = response.data.data.quote[answers.currencyTwo].price;
                console.log(chalk.white.bgBlue.bold(`\nYour result: ${json} ${answers.currencyTwo}`));
                resolve(json);
            }
        });
    });
})()