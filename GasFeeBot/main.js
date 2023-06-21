require('dotenv').config();

const { Client, MessageEmbed } = require('discord.js');
const APIHandler = require('../Core/APIHandler');

const client = new Client();
const token = process.env.BOT_TOKEN;
const prefix = process.env.PREFIX;

async function getCurrentGasPrices() {
    // Make a GET request
    let response = await APIHandler.get(process.env.ETHGASFEESTATION_URL);
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    }
    return prices;
}

client.on('message', async message => {
    if (message.content.toLowerCase().includes(prefix + 'gas')) {
	 getCurrentGasPrices().then((prices) => {

            const gasFeeEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Current ETH Gas Prices :`)
                .addFields(
                    { name: 'Low: (transaction completes in < 30 minutes)', value: `$${prices.low} USD` },
                    { name: 'Standard: (transaction completes in < 5 minutes)', value: `$${prices.medium} USD` },
                    { name: 'Fast: (transaction completes in < 2 minutes)', value: `$${prices.high} USD` }
                )

            message.channel.send(gasFeeEmbed)
        }).catch(console.log)
    }

});

client.login(token)