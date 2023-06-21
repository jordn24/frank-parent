const APIHandler = require('./APIHandler');
require('dotenv').config();

class Valorant {
    // Returns account rank
    static async getAccountRank(display_name, tag) {
        let complete_url = process.env.VALORANT_BASE_API + process.env.VALORANT_MMR_URI + encodeURIComponent(display_name) + '/' + tag;
        let response = await APIHandler.get(complete_url);
        
        return response.data.data.currenttierpatched.split(' ')[0].toLowerCase();
    }
}

module.exports = Valorant;