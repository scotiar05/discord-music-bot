const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forceskip')
        .setDescription('Force skip the current song (admin only)'),
    async execute(interaction) {
        // Implementation for forceskip command
        await interaction.reply('Forceskip command not yet implemented');
    },
};
