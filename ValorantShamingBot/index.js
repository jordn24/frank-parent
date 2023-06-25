require('dotenv').config();

const { Client, Intents} = require('discord.js');

const { messages } = require('./messages.json');
const DatabaseHandler = require('../Core/DatabaseHandler');
const APIHandler = require('../Core/APIHandler');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
  });

const token = process.env.BOT_TOKEN;
const channelid = process.env.GENERAL_CHANNEL_ID;

const { getLatestMatch, getPositionInMatch } = require('../Core/Valorant');

client.on('ready', async async => {

    // Database Connection
    const dbHandler = new DatabaseHandler(process.env.CONNECTION_URL);
    await dbHandler.connect();

    let users = await dbHandler.getUsers();
    // For every username
    users.forEach((user) => {
        // Check latest match
        getLatestMatch(user.user, user.tag).then((match_id) => {
            // Get position in latest match
            getPositionInMatch(match_id, user.user).then(async (position) => {
		        // If position is last
                // if (position === 10 && user.latest_match !== match_id) {
                    
                    // Send message in general
                    formatted_msg = "<@" + user.disc_id + "> " + messages[Math.floor(Math.random() * messages.length)]
                    tracker_link = "https://tracker.gg/valorant/match/" + match_id + "?handle=" + encodeURIComponent(user.user) + "%23" + user.tag

                    // Send to channel id in config
                    client.channels.cache.get(channelid).send(formatted_msg)
                    client.channels.cache.get(channelid).send(tracker_link)                                

                    // Call Total Matches API to update DB
                    let newActMatches = await APIHandler.post(process.env.WEB_TRACKERGG_API + process.env.WEB_TRACKERGG_ACT_URI + "?user=" + 
                        user.user + "&tag=" + user.tag);

                    let newTotalMatches = await APIHandler.post(process.env.WEB_TRACKERGG_API + process.env.WEB_TRACKERGG_TOT_URI+ "?user=" + 
                        user.user + "&tag=" + user.tag);

                    // Calculate new percentage
                    let newPercentage = (( (parseInt(user.score) + 1) / parseInt(newActMatches.data)) * 100)
                    let newAllTimePercentage = (( (parseInt(user.all_time_score) + 1) / parseInt(newTotalMatches.data)) * 100)
                    
                    if(user.score == 0){
                        newPercentage = 0;
                    }
                    if(user.all_time_score == 0){
                        newAllTimePercentage = 0;
                    }
                    
                    // Update Mongo DB
                    await dbHandler.updateUser(user._id, "score", (parseInt(user.score) + 1).toString());
                    await dbHandler.updateUser(user._id, "all_time_score", (parseInt(user.all_time_score) + 1).toString());
                    // Update Percentage
                    await dbHandler.updateUser(user._id, "percentage", newPercentage.toString());
                    await dbHandler.updateUser(user._id, "all_time_percentage", newAllTimePercentage.toString());
                    // Update latest match id
                    await dbHandler.updateUser(user._id, "latest_match", match_id);
                // } else {
                //     console.log("Not bottom.")
                // }
            })
        })
    })
    setTimeout(() => process.exit(1), 60000)
})

client.login(token)