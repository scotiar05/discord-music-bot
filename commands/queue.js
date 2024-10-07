const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { MAX_QUEUE_LENGTH, EMBED_COLOR } = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current music queue')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number of the queue')
                .setRequired(false)),

    async execute(interaction) {
        const { client } = interaction;

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        const totalPages = Math.ceil(queue.tracks.length / MAX_QUEUE_LENGTH) || 1;
        const page = (interaction.options.getInteger('page') || 1) - 1;

        if (page + 1 > totalPages) {
            return interaction.reply({ content: `Invalid page. There are only ${totalPages} pages of songs.`, ephemeral: true });
        }

        const queueString = queue.tracks.slice(page * MAX_QUEUE_LENGTH, page * MAX_QUEUE_LENGTH + MAX_QUEUE_LENGTH).map((song, i) => {
            return `**${page * MAX_QUEUE_LENGTH + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        const embed = new EmbedBuilder()
            .setTitle('Server Queue')
            .setDescription(`**Currently Playing**\n` +
                (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                `\n\n**Queue**\n${queueString}`
            )
            .setColor(EMBED_COLOR)
            .addFields(
                { name: 'Total tracks', value: queue.tracks.length.toString(), inline: true },
                { name: 'Total duration', value: queue.totalTime, inline: true },
                { name: 'Requested by', value: currentSong.requestedBy.toString(), inline: true }
            )
            .setFooter({
                text: `Page ${page + 1} of ${totalPages} | ${queue.tracks.length} song(s) | ${queue.totalTime} total duration`
            })
            .setThumbnail(currentSong.thumbnail)
            .setTimestamp();

        try {
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in queue command: ${error.message}`);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
