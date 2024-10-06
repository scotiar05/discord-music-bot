const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current song')
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('The time to seek to in seconds')
                .setRequired(true)),
    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return interaction.reply({ content: 'No music is being played!', ephemeral: true });

        const timeInSeconds = interaction.options.getInteger('time');
        if (timeInSeconds < 0 || timeInSeconds >= queue.current.durationMS / 1000)
            return interaction.reply({ content: 'Invalid time! Please provide a valid time in seconds.', ephemeral: true });

        await queue.seek(timeInSeconds * 1000);
        return interaction.reply(`Seeked to ${timeInSeconds} seconds in the current song.`);
    },
};
