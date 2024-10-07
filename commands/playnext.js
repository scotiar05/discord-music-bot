const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnext')
        .setDescription('Add a song to play next in the queue')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song to add next in the queue')
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

        try {
            await interaction.deferReply();

            const queue = client.player.getQueue(interaction.guildId);

            if (!queue || !queue.playing) {
                return interaction.followUp({ content: 'No music is currently playing!', ephemeral: true });
            }

            const searchResult = await client.player.search(query, {
                requestedBy: interaction.user
            });

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.followUp({ content: `❌ | Track **${query}** not found!` });
            }

            const track = searchResult.tracks[0];
            queue.insert(track, 0);

            const embed = new EmbedBuilder()
                .setDescription(`**[${track.title}](${track.url})** has been added to play next`)
                .setThumbnail(track.thumbnail)
                .setFooter({ text: `Duration: ${track.duration}` });

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in playnext command: ${error.message}`);
            return interaction.followUp({ content: 'There was an error while trying to add the song to play next!', ephemeral: true });
        }
    },
};
