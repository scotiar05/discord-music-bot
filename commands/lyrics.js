const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get lyrics for the current song or a specified song')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name (optional)')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = interaction.client.player.getQueue(interaction.guildId);
        let query = interaction.options.getString('query');

        if (!query && (!queue || !queue.playing)) {
            return interaction.editReply('No song is currently playing, and no query was provided.');
        }

        if (!query) {
            query = `${queue.current.title} ${queue.current.author}`;
        }

        try {
            let lyrics;
            let source;

            // Try lyrics.ovh first
            try {
                const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`, { timeout: 5000 });
                lyrics = response.data.lyrics;
                source = 'Lyrics.ovh';
            } catch (error) {
                console.error('Error fetching lyrics from lyrics.ovh:', error);
            }

            // If lyrics.ovh fails, try AZLyrics API as a fallback
            if (!lyrics) {
                try {
                    const response = await axios.get(`https://api.azlyrics.com/v1/search/${encodeURIComponent(query)}`, { timeout: 5000 });
                    if (response.data.songs && response.data.songs.length > 0) {
                        const songUrl = response.data.songs[0].url;
                        const lyricsResponse = await axios.get(`https://api.azlyrics.com/v1/lyrics/${songUrl}`, { timeout: 5000 });
                        lyrics = lyricsResponse.data.lyrics;
                        source = 'AZLyrics';
                    }
                } catch (error) {
                    console.error('Error fetching lyrics from AZLyrics:', error);
                }
            }

            if (!lyrics) {
                return interaction.editReply('No lyrics found for this song.');
            }

            // Split lyrics into chunks of 4096 characters or less (Discord embed limit)
            const chunks = lyrics.match(/.{1,4096}/gs);

            const embed = new EmbedBuilder()
                .setTitle(`Lyrics for "${query}"`)
                .setColor('#0099ff')
                .setFooter({ text: `Source: ${source}` });

            await interaction.editReply({ embeds: [embed.setDescription(chunks[0])] });

            // Send additional embeds for remaining chunks
            for (let i = 1; i < chunks.length; i++) {
                await interaction.followUp({ embeds: [new EmbedBuilder().setDescription(chunks[i]).setColor('#0099ff')] });
            }
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            await interaction.editReply('An error occurred while fetching the lyrics. Please try again later.');
        }
    },
};
