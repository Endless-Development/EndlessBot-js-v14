const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const fs = require("fs");
const path = require("path");
const config = require("../../data/config.json");
const Canvacord = require('canvacord');
const { AttachmentBuilder } = require('discord.js');
const Logger = require("../Logger");
const levelSchema = require("../schemas/level");

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
        var data = await levelSchema.findOne({ Guild: guild.id, User: member.id });
        var member = options.getMember('utente') || user;
        var memberID = member.id || user.id;

        if (!data) {
            const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setDescription("**Questo utente non ha XP**")
            .setAuthor(user.username, member.displatAvatarURL({ forceStatic: true }))

            return await interaction.reply({ embeds: [embed] });
        }

        await interaction.deferReply();

        var requiredXP = data.Level * data.Level * 20 + 20;

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
