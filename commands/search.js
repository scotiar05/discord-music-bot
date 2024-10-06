const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ytsr = require('ytsr');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a song on YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song to search for')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const query = interaction.options.getString('query');
        const searchResults = await ytsr(query, { limit: 5 });

        if (searchResults.items.length === 0) {
            return interaction.editReply('No results found.');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Search Results')
            .setDescription('React with the number to add the song to the queue.');

        searchResults.items.forEach((item, index) => {
            embed.addFields({ name: `${index + 1}. ${item.title}`, value: `Duration: ${item.duration}` });
        });

        const message = await interaction.editReply({ embeds: [embed] });

        const filter = (reaction, user) => {
            return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].includes(reaction.emoji.name) && user.id === interaction.user.id;
        };

        const collector = message.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', async (reaction, user) => {
            const index = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].indexOf(reaction.emoji.name);
            const selectedSong = searchResults.items[index];

            // Here you would typically add the song to the queue
            // For now, we'll just confirm the selection
            await interaction.followUp(`Added to queue: ${selectedSong.title}`);

            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp('Search timed out.');
            }
        });

        // Add reaction options
        await message.react('1️⃣');
        await message.react('2️⃣');
        await message.react('3️⃣');
        await message.react('4️⃣');
        await message.react('5️⃣');
    },
};
