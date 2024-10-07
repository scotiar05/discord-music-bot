const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a song to a different position in the queue')
        .addIntegerOption(option =>
            option.setName('from')
                .setDescription('The current position of the song')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('to')
                .setDescription('The new position for the song')
                .setRequired(true)),

    async execute(interaction) {
        const { client } = interaction;
        const fromPosition = interaction.options.getInteger('from');
        const toPosition = interaction.options.getInteger('to');

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

        if (fromPosition < 1 || fromPosition > queue.tracks.length || toPosition < 1 || toPosition > queue.tracks.length) {
            return interaction.reply({ content: `Invalid position. Please provide numbers between 1 and ${queue.tracks.length}.`, ephemeral: true });
        }

        try {
            const track = queue.tracks[fromPosition - 1];
            queue.remove(fromPosition - 1);
            queue.insert(track, toPosition - 1);

            const embed = new EmbedBuilder()
                .setDescription(`✅ Moved **[${track.title}](${track.url})** from position ${fromPosition} to ${toPosition}`)
                .setThumbnail(track.thumbnail)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in move command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to move the song in the queue!', ephemeral: true });
        }
    },
};
