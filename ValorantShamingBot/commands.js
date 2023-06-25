require('dotenv').config();

const { Client, MessageEmbed, MessageButton, InteractionCollector, Intents, MessageActionRow } = require('discord.js');
const DatabaseHandler = require('../Core/DatabaseHandler');

const token = process.env.BOT_TOKEN;

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
  });


function sortFields(fields, sort) {
    let sortedFields;
    let index = 1;

    if(sort == "number"){
        sortedFields = fields.sort((fieldA, fieldB) => (fieldA.raw_value < fieldB.raw_value) ? 1 : -1);
    } else if (sort == "percentage"){
        index = 1;
        sortedFields = fields.sort((fieldA, fieldB) => (fieldA.rawPercentage < fieldB.rawPercentage) ? 1 : -1);
    }

    // Add placement number in front
    for(var i = 0; i < sortedFields.length; i++){
        sortedFields[i].name = sortedFields[i].name.replace(/\d+\.\s/, '')
        sortedFields[i].name = index + ". " + sortedFields[i].name
        index = index + 1
    }

    return sortedFields;
}


client.on('messageCreate', async message => {
    if (message.content.toLowerCase() == '!scoreboard'){

        // Create buttons for options
        const option1Button = new MessageButton()
        .setCustomId('current')
        .setLabel('This Act')
        .setStyle('PRIMARY');

        const option2Button = new MessageButton()
        .setCustomId('alltime')
        .setLabel('All Time')
        .setStyle('DANGER');

        const option3Button = new MessageButton()
        .setCustomId('percentage')
        .setLabel('Percentage')
        .setStyle('SECONDARY');

        // Interactive Embed and Button Row 
        const buttonRow = new MessageActionRow()
        .addComponents(option1Button, option2Button, option3Button);

        const embed = new MessageEmbed();

        // Database Connection
        const dbHandler = new DatabaseHandler(process.env.CONNECTION_URL);
        await dbHandler.connect();
        
        let users = await dbHandler.getUsers();
        
        // Act Fields
        let actFields = []
        let allTimeFields = []
	    let index = 1

        // Add data from database to fields
        users.forEach((user) => {
            actFields.push({name: user.user + ":", value: "Has bottom fragged " + user.score + " time/s\nWith a rate of "
            + parseFloat(user.percentage).toFixed(2) + "%", raw_value: parseInt(user.score), rawPercentage: parseFloat(user.percentage)})
            allTimeFields.push({name: user.user + ":", value: "Has bottom fragged " + user.all_time_score + " time/s\nWith a rate of "
                + parseFloat(user.all_time_percentage).toFixed(2) + "%", raw_value: parseInt(user.all_time_score), rawPercentage: parseFloat(user.all_time_percentage)})
        })
        
        // Default Setting for Leaderboard
        embed.setTitle("Act Leaderboard");
        embed.setFields(sortFields(actFields, "number"));
        embed.setColor('BLUE');

        // Send the embed with the buttons as a message
        message.channel.send({ embeds: [embed] ,components: [buttonRow] })
        .then(sentMessage => {
            // Create an interaction collector to listen for button clicks
            const collector = new InteractionCollector(client, { message: sentMessage });      

            // Event handler for button interactions
            collector.on('collect', async (interaction) => {
            if (interaction.isButton()) {
                // Update the embed based on the clicked option
                const clickedOption = interaction.customId;

                switch (clickedOption) {
                case 'current':
                    embed.setTitle("Act Leaderboard");
                    embed.setFields(sortFields(actFields, "number"));
                    embed.setColor('BLUE');
                    break;
                case 'alltime':
                    embed.setTitle("All Time Leaderboard");
                    embed.setFields(sortFields(allTimeFields, "number"));
                    embed.setColor('RED');
                    break;
                case 'percentage':
                    if (embed.title === "Act Leaderboard") {
                        embed.setTitle("Act Leaderboard (Sorted by Percentage)");
                        embed.setFields(sortFields(actFields, "percentage"));
                        embed.setColor('GREY');
                    } else if (embed.title === "All Time Leaderboard") {
                        embed.setTitle("All Time Leaderboard (Sorted by Percentage)");
                        embed.setFields(sortFields(allTimeFields, "percentage"));
                        embed.setColor('GREY');
                    }
                    break;
                }
    
                // Update the embed message
                await interaction.update({ embeds: [embed] });
            }
            });
        });
    }
})

client.login(token)