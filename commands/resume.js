const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),

    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply('I am not currently in a voice channel!');
        }

        const player = connection.state.subscription.player;

        if (player.state.status !== 'paused') {
            return interaction.reply('There is no paused song to resume!');
        }

        player.unpause();
        await interaction.reply('Resumed the paused song.');
    },
};
