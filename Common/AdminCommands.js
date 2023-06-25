require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
  });
  
const token = process.env.BOT_TOKEN;
const prefix = process.env.ADMIN_PREFIX;

// When a message is received, run this code
client.on('messageCreate', (message) => {
    if (message.content.toLowerCase() == prefix + ' newact'){
       
    }
  });
  
client.login(token)