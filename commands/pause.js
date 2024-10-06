const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing song'),

    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply('I am not currently in a voice channel!');
        }

        const player = connection.state.subscription.player;

        if (player.state.status !== 'playing') {
            return interaction.reply('There is no song currently playing!');
        }

        player.pause();
        await interaction.reply('Paused the current song.');
    },
};
