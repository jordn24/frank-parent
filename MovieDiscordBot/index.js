
require('dotenv').config();
const discord = require('discord.js');
const APIHandler = require('../Core/APIHandler');

const client = new discord.Client();
const prefix = process.env.FRANK_PREFIX;


client.on('message', async message => {
    // Check if the message mentions a user named "Frank"
    const frankUser = message.mentions.users.find(user => user.username === 'Frank');
        
    if (frankUser) {
        // Check if the message contains "movie" and any of the specified words
        const messageContent = message.content.toLowerCase();
        const keywords = ["shit", "bad", "dogshit"];
        if (messageContent.includes("movie") && keywords.some(keyword => messageContent.includes(keyword))) {
            let url = process.env.MOVIE_API_URL;

            const queryParams = { 
                include_adult: 'false', 
                include_video: 'false',
                language:'en-US',
                page: 1,
                sort_by: 'popularity.asc',
                'vote_average.lte': 4,
                'vote_count.gte': 200,
                with_original_language: 'en'
            };

            const bearerToken = process.env.MOVIE_API_ACCESS_TOKEN;
            const requestHeaders = { 'Authorization': `Bearer ${bearerToken}` }; 

            const config = {
                params: queryParams,
                headers: requestHeaders,
            };

            let response = await APIHandler.get(url, config);

            let totalResults = response.data.total_results;
            let randomPick = Math.floor(Math.random() * totalResults);

            message.channel.send(response.data.results[randomPick].original_title);
            message.channel.send("https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + response.data.results[randomPick].poster_path);
        }
    }
})

client.login(process.env.BOT_TOKEN);