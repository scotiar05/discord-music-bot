const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue'),

    async execute(interaction) {
        const { client } = interaction;
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return interaction.reply({ content: 'You need to be in the same voice channel as the bot to use this command!', ephemeral: true });
        }

        if (queue.tracks.length < 2) {
            return interaction.reply({ content: 'Not enough tracks in the queue to shuffle!', ephemeral: true });
        }

        try {
            const success = queue.shuffle();

            const embed = new EmbedBuilder()
                .setDescription(`${success ? '🔀 Queue shuffled' : '❌ Failed to shuffle the queue'}`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()
                .setColor(success ? '#00FF00' : '#FF0000');

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in shuffle command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to shuffle the queue!', ephemeral: true });
        }
    },
};
