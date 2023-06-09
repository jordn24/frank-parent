require('dotenv').config({path: '/home/ec2-user/frank/frank-parent/frank-parent/.env' });

const { Client, Intents} = require('discord.js');

const { messages } = require('./messages.json');
const DatabaseHandler = require('../Core/DatabaseHandler');
const APIHandler = require('../Core/APIHandler');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
  });

const token = process.env.BOT_TOKEN;
//const channelid = process.env.GENERAL_CHANNEL_ID;
const channelid = "865432456702590978"
const { getLatestMatch, getPositionInMatch } = require('../Core/Valorant');

client.on('ready', async async => {

    // Database Connection
    const dbHandler = new DatabaseHandler(process.env.CONNECTION_URL);
    await dbHandler.connect();

    let users = await dbHandler.getUsers();
    // For every username
    for (const user of users) {
        console.log("\nStarting for: " + user.user);
        // Check latest match
        const match_id = await getLatestMatch(user.user, user.tag);
        console.log(match_id + " is the latest match");
    
        // If latest match wasn't empty
        if(match_id !== ""){
            // Get position in latest match
            const position = await getPositionInMatch(match_id, user.user);
            console.log(user.user + " finished " + position);

            // If position is last
            if (position === 10 && user.latest_match !== match_id) { 
                // Send message in general
                formatted_msg = "<@" + user.disc_id + "> " + messages[Math.floor(Math.random() * messages.length)]
                tracker_link = "https://tracker.gg/valorant/match/" + match_id + "?handle=" + encodeURIComponent(user.user) + "%23" + user.tag

                // Send to channel id in config
                client.channels.cache.get(channelid).send(formatted_msg)
                client.channels.cache.get(channelid).send(tracker_link)                                

                // Call Act Matches APIs
                const newActMatches = await APIHandler.post(process.env.WEB_TRACKERGG_API + process.env.WEB_TRACKERGG_ACT_URI + "?user=" +
                    user.user + "&tag=" + user.tag);

                // Calculate new percentage
                let newPercentage;
		let newScore = parseInt(user.score) + 1

                if(newActMatches.data > 0){
                    newPercentage =  newScore / newActMatches.data * 100
                }
                
		console.log("New Act Matches: " + newActMatches.data)
		console.log("New Percentage: " + newPercentage)
		console.log("New Act Matches: " +  newActMatches.data)
		console.log("Pre Run User Score: " + newScore)
		console.log("Match ID: " + match_id)

                if(newPercentage > 0 && newActMatches.data > 0 && newScore > 0 && match_id.length > 0){
                    // Update Scores
                    await dbHandler.updateUser(user._id, "score", newScore.toString());
                    // Update Matches
                    await dbHandler.updateUser(user._id, "matches_played", newActMatches.data.toString());
                    // Update Percentage
                    await dbHandler.updateUser(user._id, "percentage", newPercentage.toString());
                    // Update latest match id
                    await dbHandler.updateUser(user._id, "latest_match", match_id);
                } else {
                    console.log("Something went wrong with the data gathered... NOT UPDATING DB")
                }
            } else {
                console.log("Not bottom.")
            }
        }        

    }
    setTimeout(() => process.exit(1), 60000)
})

client.login(token)
