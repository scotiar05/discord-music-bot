const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('The position of the song to remove')
                .setRequired(true)),
    async execute(interaction) {
        // Implementation for remove command
        await interaction.reply('Remove command not yet implemented');
    },
};
