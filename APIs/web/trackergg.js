require('dotenv').config();

const express = require('express');
const router = express.Router();
const WebScraper = require('../../Core/WebHandler');
const DatabaseHandler = require('../../Core/DatabaseHandler');
const dbHandler = new DatabaseHandler(process.env.CONNECTION_URL);

router.post('/trackergg/getTotalMatches', async (req, res) => {
    try{
        const scraper = new WebScraper();
        let data = await scraper.getTextFromElement('https://tracker.gg/valorant/profile/riot/' + req.query.user + "%23" + req.query.tag + "/overview?season=all", process.env.TOTAL_MATCHES_SELECTOR)
        let totalMatches = data.split(' ')[1].replace(',', '')

        await dbHandler.connect();
 
        let user = await dbHandler.getUserByUsername(req.query.user);
        await dbHandler.updateUser(user._id, 'alltime_matches_played', totalMatches);
    
        res.send(totalMatches);
    } catch (error){
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

router.post('/trackergg/getActMatches', async (req, res) => {
    try{
        const scraper = new WebScraper();
        let data = await scraper.getTextFromElement('https://tracker.gg/valorant/profile/riot/' + req.query.user + "%23" + req.query.tag + "/overview", process.env.TOTAL_MATCHES_SELECTOR)
        let totalMatches = data.split(' ')[1].replace(',', '')

        await dbHandler.connect();
 
        let user = await dbHandler.getUserByUsername(req.query.user);
        await dbHandler.updateUser(user._id, 'matches_played', totalMatches);
    
        res.send(totalMatches);
    } catch (error){
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});
module.exports = router