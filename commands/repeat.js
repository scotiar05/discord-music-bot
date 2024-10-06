const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Set repeat mode')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Repeat mode (off, song, queue)')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Song', value: 'song' },
                    { name: 'Queue', value: 'queue' }
                )),
    async execute(interaction) {
        // Implementation for repeat command
        await interaction.reply('Repeat command not yet implemented');
    },
};
