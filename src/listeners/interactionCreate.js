const Logger = require("../Logger");

module.exports = {
    name: 'interactionCreate',
    run: function(interaction)
    {
        if (interaction.isChatInputCommand()) {
            Logger.Info("interaction command");
        }
    }
}
