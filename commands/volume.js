const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the volume of the music')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-100)')
                .setRequired(true)),

    async execute(interaction) {
        const volume = interaction.options.getInteger('level');

        if (volume < 0 || volume > 100) {
            return interaction.reply('Volume must be between 0 and 100.');
        }

        const connection = getVoiceConnection(interaction.guild.id);
        if (!connection) {
            return interaction.reply('I am not currently in a voice channel!');
        }

        const player = connection.state.subscription.player;
        player.state.resource.volume.setVolume(volume / 100);

        await interaction.reply(`Volume set to ${volume}%`);
    },
};
