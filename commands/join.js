const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the voice channel you are in'),

    async execute(interaction) {
        const { client } = interaction;

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        const channel = interaction.member.voice.channel;

        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            client.player.setConnection(connection);

            const embed = new EmbedBuilder()
                .setDescription(`✅ Joined voice channel: **${channel.name}**`)
                .setColor('#00ff00')
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in join command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to join the voice channel!', ephemeral: true });
        }
    },
};
