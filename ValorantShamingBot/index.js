const discord = require('discord.js')
const fs = require('fs');

const { token, usernames, channelid, messages } = require('/home/ec2-user/git/valorantShamingBot/valorantShamingBot/config.json');
const { latestMatch } = require('/home/ec2-user/git/valorantShamingBot/valorantShamingBot/data.json');
const client = new discord.Client();

const { getLatestMatch, getPositionInMatch } = require('./valorantAPI');

client.on('ready', async => {
    // For every username
    usernames.forEach((username) => {
        // Check latest match
        getLatestMatch(username.user, username.tag).then((match_id) => {
            // Get position in latest match
            getPositionInMatch(match_id, username.user).then((pos) => {
         	console.log(username.user)
		console.log(pos)
		// If position is last
                if (pos === 10 && latestMatch[username.user] !== match_id) {
                    // Send message in general
                    formatted_msg = "<@" + username.disc_id + "> " + messages[Math.floor(Math.random() * messages.length)]
                    tracker_link = "https://tracker.gg/valorant/match/" + match_id + "?handle=" + username.user + "%23" + username.tag
                    // Send to channel id in config
                    client.channels.cache.get(channelid).send(formatted_msg)
                    client.channels.cache.get(channelid).send(tracker_link)
                    // update data json
                    var data = require('/home/ec2-user/git/valorantShamingBot/valorantShamingBot/data.json');
                    // Update latest match id
                    data["latestMatch"][username.user] = match_id
                    // Iterate leaderboard score
                    console.log(data["leaderboard"][username.user])
		    data["leaderboard"][username.user] = data["leaderboard"][username.user] + 1
                    // Save to json
                    fs.writeFileSync("/home/ec2-user/git/valorantShamingBot/valorantShamingBot/data.json", JSON.stringify(data, null, 4));
                } else {
                    console.log("Not bottom.")
                }
            })
        })
    })
    setTimeout(() => process.exit(1), 60000)
})

client.login(token)