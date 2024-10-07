const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vol')
        .setDescription('Adjust the volume of the music (alias for volume)')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-100)')
                .setRequired(true)),

    async execute(interaction) {
        // Get the volume command
        const volumeCommand = interaction.client.commands.get('volume');

        if (!volumeCommand) {
            return interaction.reply({ content: 'There was an error while trying to execute this command!', ephemeral: true });
        }

        // Execute the volume command
        await volumeCommand.execute(interaction);
    },
};
