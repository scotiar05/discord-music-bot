const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing song'),

    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        const success = queue.setPaused(true);

        return interaction.reply({
            content: success ? 'The music has been paused!' : 'Something went wrong while trying to pause the music!',
        });
    },
};
