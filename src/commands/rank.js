const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const fs = require("fs");
const path = require("path");
const config = require("../../data/config.json");
const Canvacord = require('canvacord');
const { AttachmentBuilder } = require('discord.js');
const Logger = require("../Logger");

module.exports = {
    name: "rank",
    description: "Risponde con gli XP e il rank di un utente",
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Risponde con gli XP e il rank di un utente')
        .addUserOption(option => option.setName('utente').setDescription('L\'utente di cui visualizzare XP e Rank')),
    async execute(interaction, client)
    {
        if (!config.enableLeveling) return interaction.reply({ content: "Questo comando è stato disattivato", ephemeral: true});

        const { options, user, guild } = interaction;
        var data = JSON.parse(fs.readFileSync(path.resolve(__dirname + "../../../data", 'leveling.json')));
        var member = options.getMember('utente') || user;
        var memberID = member.id || user.id;

        if (data[memberID] == null) {
            const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setDescription("**Questo utente non ha XP**")
            .setAuthor(user.username, member.displatAvatarURL({ forceStatic: true }))

            await interaction.reply({ embeds: [embed] });
        }
        else {
            await interaction.deferReply();

            var level = 0;
            var requiredXP = 0;
            var userXP = data[memberID];
            
            switch (userXP) {
                case userXP >= config.level30:
                    level = 30;
                    userXP = config.level30;
                    requiredXP = config.level30;
                case userXP >= config.level29:
                    level = 29;
                    requiredXP = config.level30;
                case userXP >= config.level28:
                    level = 28;
                    requiredXP = config.level29;
                case userXP >= config.level27:
                    level = 27;
                    requiredXP = config.level28;
                case userXP >= config.level26:
                    level = 26;
                    requiredXP = config.level27;
                case userXP >= config.level25:
                    level = 25;
                    requiredXP = config.level26;
                case userXP >= config.level24:
                    level = 24;
                    requiredXP = config.level25;
                case userXP >= config.level23:
                    level = 23;
                    requiredXP = config.level24;
                case userXP >= config.level22:
                    level = 22;
                    requiredXP = config.level23;
                case userXP >= config.level21:
                    level = 21;
                    requiredXP = config.level22;
                case userXP >= config.level20:
                    level = 20;
                    requiredXP = config.level21;
                case userXP >= config.level19:
                    level = 19;
                    requiredXP = config.level20;
                case userXP >= config.level18:
                    level = 18;
                    requiredXP = config.level19;
                case userXP >= config.level17:
                    level = 17;
                    requiredXP = config.level18;
                case userXP >= config.level16:
                    level = 16;
                    requiredXP = config.level17;
                case userXP >= config.level15:
                    level = 15;
                    requiredXP = config.level16;
                case userXP >= config.level14:
                    level = 14;
                    requiredXP = config.level15;
                case userXP >= config.level13:
                    level = 13;
                    requiredXP = config.level14;
                case userXP >= config.level12:
                    level = 12;
                    requiredXP = config.level13;
                case userXP >= config.level11:
                    level = 11;
                    requiredXP = config.level12;
                case userXP >= config.level10:
                    level = 10;
                    requiredXP = config.level11;
                case userXP >= config.level9:
                    level = 9;
                    requiredXP = config.level10;    
                case userXP >= config.level8:
                    level = 8;
                    requiredXP = config.level9;
                case userXP >= config.level7:
                    level = 7;
                    requiredXP = config.level8;
                case userXP >= config.level6:
                    level = 6;
                    requiredXP = config.level7;
                case userXP >= config.level5:
                    level = 5;
                    requiredXP = config.level6;
                case userXP >= config.level4:
                    level = 4;
                    requiredXP = config.level5;
                case userXP >= config.level3:
                    level = 3;
                    requiredXP = config.level4;
                case userXP >= config.level2:
                    level = 2;
                    requiredXP = config.level3;
                case userXP >= config.level1:
                    level = 1;
                    requiredXP = config.level2;
                case userXP >= config.level0:
                    level = 0;
                    requiredXP = config.level1;
            }

            const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ forceStatic: true }))
            .setCurrentXP(userXP)
            .setRequiredXP(requiredXP)
            .setRank(1, "Rank", false)
            .setLevel(level)
            .setUsername(member.username)
            .setDiscriminator(member.discriminator)

            const card = await rank.build().catch(err => Logger.Error(err));
            const attachment = new AttachmentBuilder( card, {name:"rank.png", description: "The user rank" });
            
            const embed = new EmbedBuilder()
            .setColor(0xF71818)
            .setTitle(`${member.username}#${member.discriminator}`)
            .setImage("attachment://rank.png");

            await interaction.followUp({ embeds: [embed] });
        }
    }
}
