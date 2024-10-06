const { SlashCommandBuilder } = require('@discordjs/builders');

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
        // Implementation for move command
        await interaction.reply('Move command not yet implemented');
    },
};
