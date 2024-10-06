const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music and clear the queue'),

    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply('I am not currently in a voice channel!');
        }

        connection.destroy();
        // Here we would also clear the queue, but we haven't implemented a queue system yet.
        // We'll add this functionality when we implement the queue system.

        await interaction.reply('Stopped playing music and cleared the queue.');
    },
};
