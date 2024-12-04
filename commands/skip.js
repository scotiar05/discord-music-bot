const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    async execute(interaction) {
        const { client } = interaction;
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return interaction.reply({ content: 'You need to be in the same voice channel as the bot to use this command!', ephemeral: true });
        }

        try {
            const currentSong = queue.current;
            const success = await queue.skip();

            const embed = new EmbedBuilder()
                .setDescription(`${success ? '⏭️ Skipped' : '❌ Failed to skip'} **${currentSong.title}**`)
                .setThumbnail(currentSong.thumbnail)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()
                .setColor(success ? '#00FF00' : '#FF0000');

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in skip command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to skip the song!', ephemeral: true });
        }
    },
};
