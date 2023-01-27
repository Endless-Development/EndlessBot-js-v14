require("dotenv").config();
const fs = require("fs");
const Logger = require("./src/Logger");
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

Logger.Info("Starting bot...");

// Loads event listeners
const eventFiles = fs.readdirSync('./src/listeners').filter(file => file.endsWith('.js'));
Logger.Info("[SETUP] Registering events...");
for (const file of eventFiles) {
	const event = require(`./src/listeners/${file}`);
    Logger.Info("[SETUP] Loading event listener "+file);
	if (event.once) {
		client.once(event.name, (...args) => event.run(...args));
	} else {
		client.on(event.name, (...args) => event.run(...args));
	}
}

// Loads commands
var commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
Logger.Info("[SETUP] Loading commands...");
for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
    Logger.Info("[SETUP] Loading commands "+file);
	commands.push({
        name: command.name,
        description: command.description,
    })
}

// Slash command setup and bot startup
async function main() {
    try {
        Logger.Info("[SETUP] Loading Slash Commands");
        Routes.applicationGuildCommand
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: commands,
        });
        client.login(process.env.TOKEN);
    } catch(err) {}
}

main();
