require('dotenv').config();

const express = require('express');
const router = express.Router();
const DatabaseHandler = require('../../Core/DatabaseHandler');
const dbHandler = new DatabaseHandler(process.env.CONNECTION_URL);

router.post('/valorantShamingBot/setNewAct', async (req, res) => {
    try{
        await dbHandler.connect();
 
        let users = await dbHandler.getUsers();
        for (var user in users) {
            console.log(users[user].user)
            let newPercentage =  ( ( parseInt(users[user].all_time_score) + parseInt(users[user].score) ) / ( parseInt(users[user].alltime_matches_played) + parseInt(users[user].matches_played) ) ) * 100

            await dbHandler.updateUser(users[user]._id, 'all_time_score', parseInt(users[user].all_time_score) + parseInt(users[user].score));
            await dbHandler.updateUser(users[user]._id, 'score', '0');
            await dbHandler.updateUser(users[user]._id, 'alltime_matches_played', users[user].alltime_matches_played + users[user].matches_played);
            await dbHandler.updateUser(users[user]._id, 'matches_played', 0);
            await dbHandler.updateUser(users[user]._id, 'percentage', "0")
            await dbHandler.updateUser(users[user]._id, 'all_time_percentage', newPercentage.toString())

            // Work out percentage difference
            let percentageDifference = newPercentage - parseFloat(users[user].all_time_percentage)
            await dbHandler.updateUser(users[user]._id, 'percentage_change_last_act', percentageDifference)
        }
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