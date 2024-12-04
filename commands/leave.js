const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave the current voice channel'),

    async execute(interaction) {
        const { client } = interaction;

        if (!interaction.guild.members.me.voice.channel) {
            return interaction.reply({ content: 'I\'m not in a voice channel!', ephemeral: true });
        }

        if (interaction.member.voice.channel && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return interaction.reply({ content: 'You need to be in the same voice channel as the bot to use this command!', ephemeral: true });
        }

        const queue = client.player.getQueue(interaction.guildId);

        try {
            if (queue) {
                queue.destroy();
            }

            await interaction.guild.members.me.voice.disconnect();

            const embed = new EmbedBuilder()
                .setDescription('👋 Left the voice channel')
                .setColor('#ff0000')
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in leave command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to leave the voice channel!', ephemeral: true });
        }
    },
};
