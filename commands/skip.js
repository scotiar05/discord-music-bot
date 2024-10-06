const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { queues } = require('./queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const connection = getVoiceConnection(guildId);

        if (!connection) {
            return interaction.reply('I am not currently in a voice channel!');
        }

        const queue = queues.get(guildId);
        if (!queue || queue.isEmpty()) {
            return interaction.reply('There are no songs in the queue to skip!');
        }

        const skippedSong = queue.getCurrentSong();
        const nextSong = queue.next();

        if (nextSong) {
            // Here we would start playing the next song
            // This part depends on how we've implemented the play functionality
            // For now, we'll just acknowledge that we've skipped to the next song
            await interaction.reply(`Skipped "${skippedSong.title}". Now playing: "${nextSong.title}"`);
        } else {
            connection.destroy();
            await interaction.reply(`Skipped "${skippedSong.title}". The queue is now empty.`);
        }
    },
};
