const { spawn } = require('child_process');
const fs = require('fs');

// Read the active bot paths from the JSON file
const activeBotsData = fs.readFileSync('active-bots.json');
const activeBots = JSON.parse(activeBotsData).activeBots;

// Function to run each bot
function runBot(botDir) {
  const botProcess = spawn('node', [`${botDir}.js`]);

  botProcess.stdout.on('data', (data) => {
    console.log(`[${botDir}] ${data}`);
  });

  botProcess.stderr.on('data', (data) => {
    console.error(`[${botDir}] ${data}`);
  });
}

// Run each bot
activeBots.forEach(runBot);