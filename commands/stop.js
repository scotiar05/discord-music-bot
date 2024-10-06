const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music and clear the queue'),

    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        queue.destroy();

        return interaction.reply('Stopped playing music and cleared the queue.');
    },
};
