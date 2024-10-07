const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skip to a specific position in the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('The position to skip to')
                .setRequired(true)),
    async execute(interaction) {
        const { client } = interaction;
        const position = interaction.options.getInteger('position');

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return interaction.reply({ content: 'You need to be in the same voice channel as the bot to use this command!', ephemeral: true });
        }

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        if (position < 1 || position > queue.tracks.length) {
            return interaction.reply({ content: `Invalid position. Please provide a number between 1 and ${queue.tracks.length}.`, ephemeral: true });
        }

        try {
            const skippedTracks = queue.tracks.splice(0, position - 1);
            queue.skip();

            const embed = new EmbedBuilder()
                .setDescription(`⏭️ Skipped to track **[${queue.current.title}](${queue.current.url})** (position ${position})`)
                .setThumbnail(queue.current.thumbnail)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            if (skippedTracks.length > 0) {
                embed.addFields({ name: 'Skipped Tracks', value: skippedTracks.map((track, index) => `${index + 1}. ${track.title}`).join('\n').slice(0, 1024) });
            }

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in skipto command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to skip to the specified track!', ephemeral: true });
        }
    },
};
