const Logger = require("../Logger");

module.exports = {
    name: 'ready',
    once: true,
    run: function()
    {
        Logger.Success("[INFO] Bot is now online!");
    }
}
