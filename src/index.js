require("dotenv").config();
const fs = require("fs");
const Logger = require("./Logger");
const { Client, GatewayIntentBits, Routes } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
const { REST } = require("@discordjs/rest");
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const { loadCommands } = require("./handlers/commandHandler");

Logger.Info("Starting EndlessBot...");

// Loads event listeners
Logger.Info("[SETUP] Registering events...");
const eventFiles = fs.readdirSync('./src/listeners').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    Logger.Info("[SETUP] Loading event listener "+file);
	const event = require(`./listeners/${file}`);
	if (event.once)
		client.once(event.name, (...args) => event.run(...args));
	else
		client.on(event.name, (...args) => event.run(...args));
}

// Slash command setup and bot startup
async function main() {
    try {
        client.login(process.env.TOKEN).then(() => {
            loadCommands(client);
        });
    } catch(err) {}
}

main();
