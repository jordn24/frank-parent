require('dotenv').config();

const { Client, MessageEmbed, MessageButton, InteractionCollector, Intents, MessageActionRow } = require('discord.js');
const DatabaseHandler = require('../Core/DatabaseHandler');

const token = process.env.BOT_TOKEN;

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
  });

client.on('messageCreate', async message => {
    if (message.content.toLowerCase() == '!newscoreboard'){

        // Create buttons for options
        let option1Button = new MessageButton()
        .setCustomId('current')
        .setLabel('This Act')
        .setStyle('PRIMARY');

        const option2Button = new MessageButton()
        .setCustomId('alltime')
        .setLabel('All Time')
        .setStyle('DANGER');

        // Interactive Embed and Button Row 
        const buttonRow = new MessageActionRow()
        .addComponents(option1Button, option2Button);

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
            actFields.push({name: user.user + ":", value: "Has bottom fragged " + user.score + " time/s", raw_value: parseInt(user.score)})
            allTimeFields.push({name: user.user + ":", value: "Has bottom fragged " + user.all_time_score + " time/s\nWith a rate of "
                + user.percentage, raw_value: parseInt(user.all_time_score)})
        })

        // Sort fields
        actFields.sort((fieldA, fieldB) => (fieldA.raw_value < fieldB.raw_value) ? 1 : -1)
        allTimeFields.sort((fieldA, fieldB) => (fieldA.raw_value < fieldB.raw_value) ? 1 : -1)

        // Add placement number in front
        for(var i = 0; i < actFields.length; i++){
            actFields[i].name = index + ". " + actFields[i].name
            allTimeFields[i].name = index + ". " + allTimeFields[i].name
            index = index + 1
        }
        
        // Default Setting for Leaderboard
        embed.setTitle("Act Leaderboard");
        embed.setFields(actFields);
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
                    embed.setFields(actFields);
                    embed.setColor('BLUE');
                    break;
                case 'alltime':
                    embed.setTitle("All Time Leaderboard");
                    embed.setFields(allTimeFields);
                    embed.setColor('RED');
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