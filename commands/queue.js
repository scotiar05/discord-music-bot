const { SlashCommandBuilder } = require('@discordjs/builders');
const Queue = require('../utils/queue');

// We'll need to store queues for each guild
const queues = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current music queue'),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        let queue = queues.get(guildId);

        if (!queue || queue.isEmpty()) {
            return interaction.reply('The queue is currently empty.');
        }

        const currentSong = queue.getCurrentSong();
        const upcomingSongs = queue.getQueue();

        let response = `**Now Playing:** ${currentSong.title}\n\n**Up Next:**\n`;
        upcomingSongs.forEach((song, index) => {
            response += `${index + 1}. ${song.title}\n`;
        });

        await interaction.reply(response);
    },
};

// Export the queues map so it can be used by other commands
module.exports.queues = queues;
