const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the volume of the music')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-100)')
                .setRequired(true)),

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

        const volume = interaction.options.getInteger('level');

        if (volume < 0 || volume > 100) {
            return interaction.reply({ content: 'Volume must be between 0 and 100.', ephemeral: true });
        }

        try {
            const success = queue.setVolume(volume);

            const embed = new EmbedBuilder()
                .setDescription(`${success ? '🔊 Volume set to' : '❌ Failed to set volume to'} **${volume}%**`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()
                .setColor(success ? '#00FF00' : '#FF0000');

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in volume command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to set the volume!', ephemeral: true });
        }
    },
};
