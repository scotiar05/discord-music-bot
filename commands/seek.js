const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current song')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time to seek to (e.g., 1:30)')
                .setRequired(true)),
    async execute(interaction) {
        // Implementation for seek command
        await interaction.reply('Seek command not yet implemented');
    },
};
