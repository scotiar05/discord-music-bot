const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restart the current song'),
    async execute(interaction) {
        // Implementation for restart command
        await interaction.reply('Restart command not yet implemented');
    },
};
