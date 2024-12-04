const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a song and add it to the queue')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song to search for')
                .setRequired(true)),

    async execute(interaction) {
        const { client } = interaction;
        const query = interaction.options.getString('query');

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return interaction.reply({ content: 'You need to be in the same voice channel as the bot to use this command!', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const searchResult = await client.player.search(query, {
                requestedBy: interaction.user,
                searchEngine: 'youtube'
            });

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.followUp({ content: `No results found for "${query}"!`, ephemeral: true });
            }

            const queue = client.player.createQueue(interaction.guild, {
                metadata: interaction.channel
            });

            const embed = new EmbedBuilder()
                .setTitle(`Search results for "${query}"`)
                .setDescription(searchResult.tracks.slice(0, 5).map((t, i) => `${i + 1}. **[${t.title}](${t.url})** (${t.duration})`).join('\n'))
                .setFooter({ text: 'Type the number of the song you want to add to the queue, or type "cancel" to cancel.' });

            const response = await interaction.followUp({ embeds: [embed] });

            const collector = interaction.channel.createMessageCollector({
                filter: m => m.author.id === interaction.user.id,
                time: 30000,
                max: 1
            });

            collector.on('collect', async m => {
                if (m.content.toLowerCase() === 'cancel') {
                    collector.stop();
                    return interaction.followUp({ content: 'Search cancelled.', ephemeral: true });
                }

                const index = parseInt(m.content);

                if (isNaN(index) || index < 1 || index > Math.min(searchResult.tracks.length, 5)) {
                    return interaction.followUp({ content: 'Invalid number. Please provide a number between 1 and 5.', ephemeral: true });
                }

                collector.stop();

                const track = searchResult.tracks[index - 1];

                if (!queue.connection) await queue.connect(interaction.member.voice.channel);

                queue.addTrack(track);

                if (!queue.playing) await queue.play();

                const addedEmbed = new EmbedBuilder()
                    .setDescription(`✅ | Added **[${track.title}](${track.url})** to the queue.`)
                    .setThumbnail(track.thumbnail);

                return interaction.followUp({ embeds: [addedEmbed] });
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.followUp({ content: 'Search timed out.', ephemeral: true });
                }
            });

        } catch (error) {
            client.log(`[ERROR] Error in search command: ${error.message}`);
            return interaction.followUp({ content: 'There was an error while searching for the song!', ephemeral: true });
        }
    },
};
