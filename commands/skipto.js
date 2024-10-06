const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skip to a specific position in the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('The position to skip to')
                .setRequired(true)),
    async execute(interaction) {
        // Implementation for skipto command
        await interaction.reply('Skipto command not yet implemented');
    },
};
