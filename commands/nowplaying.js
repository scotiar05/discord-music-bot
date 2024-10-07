const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display information about the currently playing track'),

    async execute(interaction) {
        const { client } = interaction;

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setDescription(`🎶 | **${queue.current.title}**`)
            .addFields(
                { name: 'Duration', value: `\`${queue.current.duration}\``, inline: true },
                { name: 'Requested by', value: `${queue.current.requestedBy}`, inline: true },
                { name: 'Progress', value: progress }
            )
            .setThumbnail(queue.current.thumbnail)
            .setColor('#FF0000')
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
