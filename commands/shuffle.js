const { SlashCommandBuilder } = require('@discordjs/builders');
const { queues } = require('./queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue'),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const queue = queues.get(guildId);

        if (!queue || queue.isEmpty()) {
            return interaction.reply('The queue is currently empty.');
        }

        const currentSong = queue.getCurrentSong();
        const songs = queue.getQueue();

        // Fisher-Yates shuffle algorithm
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }

        queue.clear();
        queue.add(currentSong);
        songs.forEach(song => queue.add(song));

        await interaction.reply('The queue has been shuffled!');
    },
};
