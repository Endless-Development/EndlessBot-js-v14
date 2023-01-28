const Logger = require("../Logger");
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client)
    {
        Logger.Success(`[INFO] Bot is now online! Logged in as ${client.user.username}`);

        client.user.setPresence({
            activities: [
                {
                    name: "discord.io/endlessnet",
                    type: ActivityType.Playing
                }
            ],
            status: "online",
        });
    },
};
