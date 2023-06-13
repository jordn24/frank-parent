require('dotenv').config();

const axios = require('axios')
const { Client, MessageEmbed } = require('discord.js');
const { prefix } = require('./config.json');

const client = new Client();
const token = process.env.BOT_TOKEN;

async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    }
    return prices;
}

client.on('message', async message => {

console.log(message.content)
    if (message.content.toLowerCase().includes(prefix + 'gas')) {
	 console.log("It ran")
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