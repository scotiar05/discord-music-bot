const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnext')
        .setDescription('Add a song to play next in the queue')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song to add next in the queue')
                .setRequired(true)),
    async execute(interaction) {
        // Implementation for playnext command
        await interaction.reply('Playnext command not yet implemented');
    },
};
