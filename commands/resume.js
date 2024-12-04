const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),

    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        const success = queue.setPaused(false);

        return interaction.reply({
            content: success ? 'The music has been resumed!' : 'Something went wrong while trying to resume the music!',
        });
    },
};
