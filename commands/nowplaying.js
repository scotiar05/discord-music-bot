const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display information about the currently playing song'),
    async execute(interaction) {
        // Implementation for nowplaying command
        await interaction.reply('Now playing command not yet implemented');
    },
};
