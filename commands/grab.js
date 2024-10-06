const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Save the current song to your DMs'),
    async execute(interaction) {
        // Implementation for grab command
        await interaction.reply('Grab command not yet implemented');
    },
};
