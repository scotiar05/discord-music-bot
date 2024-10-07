const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('The position of the song to remove (1 is next song)')
                .setRequired(true)),

    async execute(interaction) {
        const { client } = interaction;
        const position = interaction.options.getInteger('position');

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return interaction.reply({ content: 'You need to be in the same voice channel as the bot to use this command!', ephemeral: true });
        }

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        if (position < 1 || position > queue.tracks.length) {
            return interaction.reply({ content: `Invalid position. Please provide a number between 1 and ${queue.tracks.length}.`, ephemeral: true });
        }

        try {
            const trackIndex = position - 1;
            const trackToRemove = queue.tracks[trackIndex];
            queue.remove(trackIndex);

            const embed = new EmbedBuilder()
                .setDescription(`✅ Removed **[${trackToRemove.title}](${trackToRemove.url})** from the queue`)
                .setThumbnail(trackToRemove.thumbnail)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in remove command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to remove the song from the queue!', ephemeral: true });
        }
    },
};
