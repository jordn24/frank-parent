
require('dotenv').config();
const discord = require('discord.js');
const GoogleSheets = require('../Core/GoogleSheets');
const Valorant = require('../Core/Valorant');

const client = new discord.Client();
const prefix = process.env.PREFIX;

const spreadsheetId = process.env.GAME_ACCS_SPREADSHEET_ID;
const range = 'PublicValorantAccs';

const sheetsHandler = new GoogleSheets(spreadsheetId);

client.on('message', async message => {
    if (message.content.toLowerCase().startsWith(prefix + 'val rank')){
        if(!message.member.roles.cache.has('861115857810489365')){
            return message.channel.send("You don't have permission to use this.")
        }
        // Split the message content into an array of words
        const args = message.content.split(' ');

        // Retrieve the rank value at index 2
        const input = args[2];
        
        let targetRank
        switch(input){
            case "iron":
                targetRank = "iron"
                break;
            case "bronze":
                targetRank = "bronze"
                break;
            case "silver":
                targetRank = "silver"
                break;
            case "gold":
                targetRank = "gold"
                break;
            case "platinum":
            case "plat":
                targetRank = "platinum"
                break;
            case "diamond":
            case "dia":
                targetRank = "diamond"    
                break;
            case 'immortal':
            case "immo":
            case "imm":
                targetRank = "immortal"
                break;
            default:
                message.reply("Invalid Command")
                return
        }
        
        message.reply("Finding account...").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })

        let targetAccounts;
        // Get sheet data
        sheetsHandler.getSheetData(range)
        .then(accounts => {
            accounts.forEach(async account => {
                // Check rank on each account
                let account_rank = await Valorant.getAccountRank(account[0], account[1]);
                if (account_rank == targetRank) {
                    targetAccounts.push(account)
                }
            });
        })
        .catch(error => {
            message.reply("Something went wrong with reading sheet data")
        });

        if(targetAccounts.length > 0){
            let account = targetAccounts[Math.floor(Math.random() * targetAccounts.length)];
             // DM user with random account from selected
            message.author.send("\nAccount: " + account[0] +  "\nUser: " + account[2] + "\npass: " + account[3]
            + "\n\n*** Deleting in 2 minutes ***")
            .then(msg => {
                setTimeout(() => msg.delete(), 120000)
            })
            message.reply("Found account, check DMs")
        } else {
            message.reply("No account with that rank.")
        }
    } 
})
  
client.login(process.env.BOT_TOKEN);