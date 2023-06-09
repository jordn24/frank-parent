const APIHandler = require('./APIHandler');
require('dotenv').config();

class Valorant {

    // Returns account rank
    static async getAccountRank(display_name, tag) {
        let complete_url = process.env.VALORANT_BASE_API + process.env.VALORANT_MMR_URI + encodeURIComponent(display_name) + '/' + tag;
        let response = await APIHandler.get(complete_url);
        if(!response){
            return 
        } else {
            
        }
        return response.data.data.currenttierpatched.split(' ')[0].toLowerCase();
    }

    // Returns latest match id of user
    static async getLatestMatch(user, tag){    
        let complete_url = process.env.VALORANT_BASE_API + process.env.VALORANT_MATCHES_URI + encodeURIComponent(user) + '/' + tag + '?filter=competitive';
        let response = await APIHandler.get(complete_url);

        if(response.data.data[0] != undefined){
            return response.data.data[0].metadata.matchid;
        }
        return ""
    }
    
    // Returns position of user in match
    static async getPositionInMatch(match_id, user){
        let complete_url = process.env.VALORANT_BASE_API + process.env.VALORANT_MATCH_URI + match_id;
        let response = await APIHandler.get(complete_url);
        
        var players = response.data.data.players.all_players
        var scores = []

        for (var player in players) {
            scores.push([players[player].name, players[player].stats.score]);
        }        

        scores.sort((scoreA, scoreB) => (scoreA[1] > scoreB[1]) ? 1 : -1)
        
        let position = -1;
        console.log(scores[0][0].toLowerCase() + " is being compared to " + user.toLowerCase())
        if(scores[0][0].toLowerCase() === user.toLowerCase()) {
            position = 10
        }

        return position
    }
}

module.exports = Valorant;