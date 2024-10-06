const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (interaction.options.getInteger('page') || 1) - 1;

        if (page > totalPages) {
            return interaction.reply({ content: `Invalid page. There are only ${totalPages} pages of songs.`, ephemeral: true });
        }

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        const embed = new EmbedBuilder()
            .setTitle('Server Queue')
            .setDescription(`**Currently Playing**\n` +
                (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                `\n\n**Queue**\n${queueString}`
            )
            .setColor('#0099ff')
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
