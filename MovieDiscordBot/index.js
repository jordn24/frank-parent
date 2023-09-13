
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
        // if (messageContent.includes("movie") && keywords.some(keyword => messageContent.includes(keyword))) {
        if (messageContent.includes("movie")) {
            let url = process.env.MOVIE_API_URL;

            let queryParams = { 
                include_adult: 'false', 
                include_video: 'false',
                language:'en-US',
                page: 1,
                sort_by: 'popularity.asc',
                'vote_average.lte': 5,
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

            let totalPages = response.data.total_pages;

            let randomPage = Math.floor(Math.random() * totalPages);
            // Get Results from Random page
            queryParams.page = randomPage;

            response = await APIHandler.get(url, config);

            let randomPick = Math.floor(Math.random() * response.data.results.length);

            message.channel.send(response.data.results[randomPick].original_title);
            message.channel.send("https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + response.data.results[randomPick].poster_path);
        }
    }
});

client.login(process.env.BOT_TOKEN);