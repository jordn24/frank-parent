require('dotenv').config();

const express = require('express');
const router = express.Router();
const WebScraper = require('../../Core/WebHandler');
const DatabaseHandler = require('../../Core/DatabaseHandler');

router.post('/trackergg/getTotalMatches', async (req, res) => {
    try{
        const scraper = new WebScraper();
        let data = await scraper.getTextFromElement('https://tracker.gg/valorant/profile/riot/' + req.query.user + "%23" + req.query.tag + "/overview?season=all", process.env.TOTAL_MATCHES_SELECTOR)
        let totalMatches = data.split(' ')[1].replace(',', '')
    
        res.send(totalMatches);
    } catch (error){
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

router.post('/trackergg/getTotalMatchesFromAct3Episode5', async (req, res) => {
    try{
        const scraper = new WebScraper();
        let data;
        let totalMatches = 0;

        let seasonIds = ["aca29595-40e4-01f5-3f35-b1b3d304c96e", "9c91a445-4f78-1baa-a3ea-8f8aadf4914d", "34093c29-4306-43de-452f-3f944bde22be"]

        for (const id of seasonIds) {
            data = await scraper.getTextFromElement('https://tracker.gg/valorant/profile/riot/' + req.query.user + "%23" + req.query.tag + 
            "/overview?season=" + id, process.env.TOTAL_MATCHES_SELECTOR);
            totalMatches = totalMatches +  parseInt(data.split(' ')[1].replace(',', ''));
        }
        
        res.send(totalMatches.toString());
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
    
        res.send(totalMatches);
    } catch (error){
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});
module.exports = router