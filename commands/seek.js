const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current track')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time to seek to (e.g., 1:30, 2m30s)')
                .setRequired(true)),

    async execute(interaction) {
        const { client } = interaction;

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

        const timeString = interaction.options.getString('time');
        const seconds = parseTimeString(timeString);

        if (isNaN(seconds)) {
            return interaction.reply({ content: 'Invalid time format. Please use a format like "1:30" or "2m30s".', ephemeral: true });
        }

        if (seconds > queue.current.durationMS / 1000) {
            return interaction.reply({ content: 'The specified time is longer than the track duration!', ephemeral: true });
        }

        try {
            await queue.seek(seconds * 1000);

            const embed = new EmbedBuilder()
                .setDescription(`⏩ Seeked to ${formatTime(seconds)} in the current track.`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in seek command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to seek!', ephemeral: true });
        }
    },
};

function parseTimeString(timeString) {
    const regex = /^(?:(\d+):)?(\d+)(?::(\d+))?$/;
    const match = timeString.match(regex);

    if (match) {
        const [, hours, minutes, seconds] = match.map(Number);
        return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    }

    const timeRegex = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
    const timeMatch = timeString.match(timeRegex);

    if (timeMatch) {
        const [, hours, minutes, seconds] = timeMatch.map(x => Number(x) || 0);
        return hours * 3600 + minutes * 60 + seconds;
    }

    return NaN;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}
