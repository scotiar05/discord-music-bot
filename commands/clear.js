const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the entire queue'),
    async execute(interaction) {
        // Implementation for clear command
        await interaction.reply('Clear command not yet implemented');
    },
};
