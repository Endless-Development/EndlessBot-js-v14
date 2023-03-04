const fs = require("fs");
const Logger = require("./Logger");
const path = require("path");

function GetConfig() {
    var configData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/config.json')));

    if (configData)
        return configData;

    Logger.Error("[ConfigManager] Could not load the config data.");
    return;
}
function GetLang() {
    var config = GetConfig();
    var langFile = config["langFile"];
    
    if (langFile) {
        var langData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/' + langFile)));
        if (langData)
            return langData;
        
        Logger.Error("[ConfigManager] Could not load the \"" + langFile + "\" lang file.");
        return;
    }

    Logger.Error("[ConfigManager] Could not find the \"langFile\" option in the config.");
    return;
}

exports.GetConfig = GetConfig;
exports.GetLang = GetLang;