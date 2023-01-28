const Logger = require("../Logger");

function loadEvents(client)
{
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading("Event Listener", "Status");
    
    Logger.Info("[SETUP] Registering Events");
    const eventFiles = fs.readdirSync('./src/listeners').filter((file) => file.endsWith('.js'));
    for (const file of eventFiles)
    {
        const event = require(`../listeners/${file}`);

        if (event.rest) {
            if (event.once)
                client.rest.once(event.name, (...args) => event.execute(...args, client));
            else
                client.rest.on(event.name, (...args) => event.execute(...args, client));
        } else {
            if (event.once)
                client.once(event.name, (...args) => event.execute(...args, client));
            else
                client.on(event.name, (...args) => event.execute(...args, client));
        }
        table.addRow(file, "Loaded");
    }

    Logger.Info(table.toString());
}

module.exports = { loadEvents };
