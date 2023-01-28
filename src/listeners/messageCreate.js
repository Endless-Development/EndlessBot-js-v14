const Logger = require("../Logger");
const fs = require("fs");
const path = require("path");
const config = require("../../data/config.json");

module.exports = {
    name: 'messageCreate',
    execute(message)
    {
        if (!config.enableLeveling) return;

        // Leveling system
        if (message.author.bot || !message.guild) return;
        if (message.guild.id != process.env.GUILD_ID) return;

        var data = JSON.parse(fs.readFileSync(path.resolve(__dirname + "../../../data", 'leveling.json')));

        if (data[message.author.id] == null) data[message.author.id] = 1;
        else data[message.author.id]++;

        var newData = JSON.stringify(data);
        fs.writeFileSync(path.resolve(__dirname + "../../../data", 'leveling.json'), newData);
    }
}
