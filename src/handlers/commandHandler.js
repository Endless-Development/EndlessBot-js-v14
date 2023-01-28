const Logger = require("../Logger");

function loadCommands(client)
{
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading("Commands", "Status");
    
    var commands = [];

    Logger.Info("[SETUP] Loading Commands");
    const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));
    for (const file of commandFiles)
    {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
        table.addRow(file, "Loaded");
    }

    client.application.commands.set(commands);
    Logger.Info(table.toString());
}

module.exports = { loadCommands };
