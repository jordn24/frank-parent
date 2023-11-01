module.exports = {
    apps: [
      {
        name: 'AccountSharingBot',
        script: 'AccountSharingBot/index.js',
        watch: true,
      },
      {
        name: 'APIs',
        script: 'APIs/server.js',
        watch: true,
      },
      {
        name: 'MovieDiscordBot',
        script: 'MovieDiscordBot/index.js',
        watch: true,
      },
      {
        name: 'ValorantShamingBot',
        script: 'ValorantShamingBot/commands.js',
        watch: true,
      },
    ],
  };
  