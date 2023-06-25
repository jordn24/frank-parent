require('dotenv').config();

const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../../Core/DatabaseHandler');
const dbHandler = new DatabaseHandler(process.env.CONNECTION_URL);

router.post('/valorantShamingBot/setNewAct', async (req, res) => {
    try{
        await dbHandler.connect();
 
        let users = await dbHandler.getUsers();

        users.forEach(async (user) => {
            await dbHandler.updateUser(user._id, 'all_time_score', user.all_time_score + user.score);
            await dbHandler.updateUser(user._id, 'score', '0');
        })
    
        res.send("Done.");
    } catch (error){
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

router.post('/valorantShamingBot/updateUsername', async (req, res) => {
    try{
        await dbHandler.connect();
 
        let user = await dbHandler.getUserByUsername(query.req.user);

        await dbHandler.updateUser(user._id, 'user', query.req.newName);

        res.send("Updated user from " + user.user + " to " + query.req.newName);
    } catch (error){
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

module.exports = router