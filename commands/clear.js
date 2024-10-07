const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the current queue'),

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

        try {
            const currentSong = queue.current;
            const queueLength = queue.tracks.length;
            queue.clear();

            const embed = new EmbedBuilder()
                .setDescription(`🧹 Cleared ${queueLength} song${queueLength !== 1 ? 's' : ''} from the queue`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()
                .setColor('#00FF00');

            if (currentSong) {
                embed.addFields({ name: 'Currently Playing', value: `${currentSong.title} by ${currentSong.author}` });
            }

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in clear command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to clear the queue!', ephemeral: true });
        }
    },
};
