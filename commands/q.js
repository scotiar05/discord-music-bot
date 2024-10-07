const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('q')
        .setDescription('Display the current music queue (alias for queue)')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number of the queue')
                .setRequired(false)),

    async execute(interaction) {
        // Get the queue command
        const queueCommand = interaction.client.commands.get('queue');

        if (!queueCommand) {
            return interaction.reply({ content: 'There was an error while trying to execute this command!', ephemeral: true });
        }

        // Execute the queue command
        await queueCommand.execute(interaction);
    },
};
