const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Save the current song to your DMs'),
    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        const currentTrack = queue.current;

        const embed = new EmbedBuilder()
            .setTitle('Grabbed Song')
            .setDescription(`Here's the song you grabbed from ${interaction.guild.name}`)
            .addFields(
                { name: 'Title', value: currentTrack.title },
                { name: 'Artist', value: currentTrack.author },
                { name: 'Duration', value: currentTrack.duration },
                { name: 'URL', value: currentTrack.url }
            )
            .setThumbnail(currentTrack.thumbnail)
            .setColor('#00FF00')
            .setTimestamp();

        try {
            await interaction.user.send({ embeds: [embed] });
            return interaction.reply({ content: 'I\'ve sent you a DM with the song information!', ephemeral: true });
        } catch (error) {
            console.error('Error sending DM:', error);
            return interaction.reply({ content: 'I couldn\'t send you a DM. Please check your privacy settings.', ephemeral: true });
        }
    },
};
