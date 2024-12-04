const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forward')
        .setDescription('Forward the current track by a specified amount of time')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time to forward (e.g., 30s, 1m, 1:30)')
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
            return interaction.reply({ content: 'Invalid time format. Please use a format like "30s", "1m", or "1:30".', ephemeral: true });
        }

        const currentTime = queue.currentTime;
        const duration = queue.current.duration * 1000;
        const newTime = Math.min(duration, currentTime + seconds * 1000);

        try {
            await queue.seek(newTime);

            const embed = new EmbedBuilder()
                .setDescription(`⏩ Forwarded the track by ${formatTime(seconds)}. Current position: ${formatTime(newTime / 1000)}`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in forward command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to forward!', ephemeral: true });
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
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}
