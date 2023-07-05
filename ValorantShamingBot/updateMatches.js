require('dotenv').config({ path: '../.env' });

const DatabaseHandler = require('../Core/DatabaseHandler');
const APIHandler = require('../Core/APIHandler');

async function main() {
  // Connect to db
  const dbHandler = new DatabaseHandler(process.env.CONNECTION_URL);
  await dbHandler.connect();

  // Get Users
  let users = await dbHandler.getUsers();

  // Loop Users
  let newActMatches;
  let newPercentage;

  for (const user of users) {
    // Call matches API
    newActMatches = await APIHandler.post(process.env.WEB_TRACKERGG_API + process.env.WEB_TRACKERGG_ACT_URI + "?user=" +
      user.user + "&tag=" + user.tag);

    console.log("\nUser:", user.user);
    console.log("User Score:", user.score);
    console.log("API Data:", newActMatches.data);

    const userScore = parseInt(user.score);
    const apiData = parseInt(newActMatches.data);

   if (!isNaN(userScore) && !isNaN(apiData)) {
      if (apiData == 0){
        newPercentage = 0;
      } else {
        newPercentage = (userScore / apiData) * 100;
      }
      // Update Matches
      await dbHandler.updateUser(user._id, "matches_played", newActMatches.data);
      // Update Percentage
      await dbHandler.updateUser(user._id, "percentage", newPercentage.toString());
    } else {
        console.log("Somethings wrong with the data")
    }
  }

  // Close the database connection after the loop is finished
  await dbHandler.disconnect();
}

// Call the main function to execute the code
main()
  .catch(error => {
    console.error('Error in main function:', error);
  });
