const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or playlist')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song or playlist to play (URL or search query)')
                .setRequired(true)),

    async execute(interaction) {
        const query = interaction.options.getString('query');

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        await interaction.deferReply();

        const { client } = interaction;

        try {
            const searchResult = await client.player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.followUp({ content: 'No results found!', ephemeral: true });
            }

            const queue = await client.player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                client.player.deleteQueue(interaction.guildId);
                return interaction.followUp({ content: 'Could not join your voice channel!', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff');

            if (searchResult.playlist) {
                queue.addTracks(searchResult.tracks);
                embed
                    .setDescription(`**${searchResult.tracks.length} songs from [${searchResult.playlist.title}](${searchResult.playlist.url})** have been added to the queue.`)
                    .setThumbnail(searchResult.playlist.thumbnail);
            } else {
                queue.addTrack(searchResult.tracks[0]);
                embed
                    .setDescription(`**[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})** has been added to the queue.`)
                    .setThumbnail(searchResult.tracks[0].thumbnail)
                    .setFooter({ text: `Duration: ${searchResult.tracks[0].duration}` });
            }

            if (!queue.playing) await queue.play();
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in play command: ${error.message}`);
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
