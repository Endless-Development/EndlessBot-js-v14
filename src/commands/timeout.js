const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const fs = require("fs");
const Logger = require("../Logger");
const ms = require("ms");
const cm = require("../ConfigManager");

module.exports = {
    name: cm.GetLang()["timeout.name"] || "timeout",
    description: cm.GetLang()["timeout.desc"] || "Timeout an user",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: cm.GetLang()["timeout.options.user"] || "user",
            description: cm.GetLang()["timeout.options.userDesc"] || "The user you are timing out",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: cm.GetLang()["timeout.options.duration"] || "duration",
            description: cm.GetLang()["timeout.options.durationDesc"] || "How long it will last (Format example: 5d 2h)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: cm.GetLang()["timeout.options.reason"] || "reason",
            description: cm.GetLang()["timeout.options.reasonDesc"] || "Why you are timing out this user",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    execute: async (interaction, client) => {
        const user = interaction.options.get(cm.GetLang()["timeout.options.user"]).value;
        var duration = interaction.options.get(cm.GetLang()["timeout.options.duration"]).value;
        const reason = interaction.options.get(cm.GetLang()["timeout.options.reason"]).value || cm.GetLang()["timeout.noReason"];

        await interaction.deferReply();

        const member = await interaction.guild.members.fetch(user);
        if (!member) {
            await interaction.editReply({ content: cm.GetLang()["errors.targetNotFound"], ephemeral: true });
            return;
        }

        if (member.user.bot) {
            await interaction.editReply({ content: cm.GetLang()["errors.targetIsBot"], ephemeral: true });
        }

        duration = ms(duration);
        if (isNaN(duration)) {
            await interaction.editReply({ content: cm.GetLang()["errors.durationInvalid"], ephemeral: true });
            return;
        }

        const minDuration = cm.GetConfig()["timeout.minDuration"];
        const maxDuration = cm.GetConfig()["timeout.maxDuration"];
        if (duration < minDuration || duration > maxDuration) {
            const { default: prettyMs } = await import('pretty-ms');
            await interaction.editReply({ content: cm.GetLang()["errors.durationInvalidLength"]
                .replace("{min}", prettyMs(minDuration)).replace("{max}", prettyMs(maxDuration)), ephemeral: true });
            return;
        }

        const staffRolePosition = interaction.member.roles.highest.position;
        const targetRolePosition = member.roles.highest.position;

        if (targetRolePosition >= staffRolePosition) {
            await interaction.editReply({ content: cm.GetLang()["errors.rolePriority"], ephemeral: true });
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');

            await member.timeout(duration, reason);
            await interaction.editReply({ content: cm.GetLang()["timeout.stafferMessage"]
                .replace("{member}", member).replace("{duration}", duration), ephemeral: true });

            if (cm.GetConfig()["timeout.enableLogChannel"]) {
                const channel = interaction.guild.channels.fetch(cm.GetConfig()["timeout.logChannelID"]);
                const embed = new EmbedBuilder()
                    .setTitle(cm.GetConfig()["timeout.embed.title"])
                    .addFields(
                        { name: cm.GetConfig()["timeout.embed.target"], value: "`"+member.username+"#"+member.discriminator+"`", inline: true },
                        { name: cm.GetConfig()["timeout.embed.duration"], value: "`"+prettyMs(duration)+"`", inline: true },
                        { name: cm.GetConfig()["timeout.embed.reason"], value: "`"+duration+"`" })
                    .addFooter({ text: interaction.member.username+"#"+interaction.member.discriminator, iconURL: interaction.member.displayAvatarURL() })
                    .setColor(cm.GetConfig()["timeout.logEmbedColor"]);

                channel.send({ embeds: [ embed ] })
            }
            return;
        }
        catch (err)
        { Logger.Error(err); }
    }
}