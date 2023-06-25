const APIHandler = require('./APIHandler');
const cheerio = require('cheerio');

class WebScraper {
  async getTextFromElement(url, selector) {
    try {
        let response = await APIHandler.get(url);
        const html = response.data;

        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Find the element using the selector
        const element = $(selector);

        // Retrieve the text content of the element
        const text = element.text();

        // Return the extracted data
        return text;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
  }
}

module.exports = WebScraper;