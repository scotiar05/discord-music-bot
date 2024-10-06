const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Display lyrics for the current song'),
    async execute(interaction) {
        // Implementation for lyrics command
        await interaction.reply('Lyrics command not yet implemented');
    },
};
