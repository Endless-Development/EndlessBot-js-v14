require("dotenv").config();
const fs = require("fs");
const Logger = require("./Logger");
const { Client, GatewayIntentBits, Routes, Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const { loadCommands } = require("./handlers/commandHandler");
const { loadEvents } = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();

async function main() {
    try {
        Logger.Info("Starting EndlessBot...");
        client.login(process.env.TOKEN).then(() => {
            loadEvents(client);
            loadCommands(client);
        });
    } catch(err) {}
}

main();
