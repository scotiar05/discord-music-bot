const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect the bot from the voice channel (alias for leave)'),

    async execute(interaction) {
        // Get the leave command
        const leaveCommand = interaction.client.commands.get('leave');

        if (!leaveCommand) {
            return interaction.reply({ content: 'There was an error while trying to execute this command!', ephemeral: true });
        }

        // Execute the leave command
        await leaveCommand.execute(interaction);
    },
};
