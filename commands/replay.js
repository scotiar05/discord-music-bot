const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the current track from the beginning'),

    async execute(interaction) {
        const { client } = interaction;

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

        try {
            await queue.seek(0);

            const embed = new EmbedBuilder()
                .setDescription(`🔁 Replaying **[${queue.current.title}](${queue.current.url})**`)
                .setThumbnail(queue.current.thumbnail)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in replay command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to replay the track!', ephemeral: true });
        }
    },
};
