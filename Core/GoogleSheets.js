const { google } = require('googleapis');
const sheets = google.sheets('v4');
const credentials = require('../AccountSharingBot/sheets-credentials.json')

// Google Sheets Handler Class
class GoogleSheets {
  constructor(spreadsheetId) {
    this.spreadsheetId = spreadsheetId;
  }

  async getSheetData(range) {
    try {
      // Create a new JWT client using the credentials
      const client = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
      );
  
      // Authorize the client
      await client.authorize();
  
      // Create a new instance of the Google Sheets API
      const sheets = google.sheets({ version: 'v4', auth: client });
  
      // Make the API request to retrieve spreadsheet values
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });
  
      // Access the values from the response
      const values = response.data.values;
      return values;
    } catch (error) {
      console.error('Error retrieving sheet data:', error);
      throw error;
    }
  }
  

  async updateSheetData(range, values) {
    try {
      // Create a new JWT client using the credentials
      const client = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      // Authorize the client
      await client.authorize();

      // Make the API request to update spreadsheet values
      const response = await sheets.spreadsheets.values.update({
        auth: client,
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      if (response.status !== 200) {
        console.error('Error updating sheet data:', response.statusText);
        throw new Error('Failed to update sheet data.');
      }
    } catch (error) {
      console.error('Error updating sheet data:', error);
      throw error;
    }
  }
}

module.exports = GoogleSheets;