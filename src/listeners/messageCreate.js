const Logger = require("../Logger");
const fs = require("fs");
const path = require("path");
const config = require("../../data/config.json");
const levelSchema = require("../schemas/level");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'messageCreate',
    async execute(message)
    {
        // Leveling system
        if (!config.enableLeveling) return;
        if (message.author.bot || !message.guild) return;
        if (message.guild.id != process.env.GUILD_ID) return;

        levelSchema.findOne({ Guild: guild.id, User: author.id}, async (err, data) => {
            
            if (err) throw err;

            if (!data) {
                levelSchema.create({
                    Guild: guild.id,
                    User: author.id,
                    XP: 0,
                    Level: 0,
                })
            }
        })

        const channel = message.channel;
        const give = 1;
        const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});

        if (!data) return;

        const requiredXP = data.Level * data.Level * 20 + 20;

        if (data.XP + give >= requiredXP) {
            data.XP += give;
            data.Level += 1;
            await data.save();

            if (!channel) return;

            const embed = new EmbedBuilder()
            .setColor(0xF71818)
            .setDescription(`${author}, hai raggiunto il livello ${data.Level}`)

            channel.send({ embeds: [embed] });
        }
        else {
            data.XP += give;
            data.save();
        }
    }
}
