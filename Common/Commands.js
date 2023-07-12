require('dotenv').config();

const { Client, MessageEmbed, MessageButton, InteractionCollector, Intents, MessageActionRow } = require('discord.js');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
  });
  
const token = process.env.BOT_TOKEN;
const prefix = process.env.FRANK_PREFIX;

// When a message is received, run this code
client.on('messageCreate', (message) => {
    if (message.content === prefix + ' help') {
        const option2Button = new MessageButton()
        .setCustomId('accountsharingbot')
        .setLabel('Account Bot')
        .setStyle('DANGER');
        
        const buttonRow = new MessageActionRow()
        .addComponents(option2Button);

        const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Frank Help')

        // Send the embed with the buttons as a message
        message.channel.send({ components: [buttonRow] })
        .then(sentMessage => {
          // Create an interaction collector to listen for button clicks
          const collector = new InteractionCollector(client, { message: sentMessage });
  
          // Event handler for button interactions
          collector.on('collect', async (interaction) => {
            if (interaction.isButton()) {
              // Update the embed based on the clicked option
              const clickedOption = interaction.customId;
              embed.fields = [];
  
              switch (clickedOption) {
                case 'accountsharingbot':
                    embed.setTitle("Account Sharing Commands");
                    embed.addFields([
                        {name: "Valorant Accounts In One Rank", value: "!val -rank [rank]"},
                    ]);
                    embed.setColor('RED');
                    break;
              }
  
              // Update the embed message
              await interaction.update({ embeds: [embed] });
            }
          });
        });
    }
  });
  

client.login(token)
