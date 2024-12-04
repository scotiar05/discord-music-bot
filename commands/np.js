const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('np')
        .setDescription('Display information about the currently playing track (alias for nowplaying)'),

    async execute(interaction) {
        // Get the nowplaying command
        const nowplayingCommand = interaction.client.commands.get('nowplaying');

        if (!nowplayingCommand) {
            return interaction.reply({ content: 'There was an error while trying to execute this command!', ephemeral: true });
        }

        // Execute the nowplaying command
        await nowplayingCommand.execute(interaction);
    },
};
