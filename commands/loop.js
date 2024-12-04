const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set the loop mode')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' }
                )),

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

        const loopMode = interaction.options.getString('mode');
        let mode;

        switch (loopMode) {
            case 'off':
                mode = QueueRepeatMode.OFF;
                break;
            case 'track':
                mode = QueueRepeatMode.TRACK;
                break;
            case 'queue':
                mode = QueueRepeatMode.QUEUE;
                break;
        }

        try {
            mode = queue.setRepeatMode(mode);

            const modeStr = mode === QueueRepeatMode.TRACK ? 'Track' : mode === QueueRepeatMode.QUEUE ? 'Queue' : 'Off';

            const embed = new EmbedBuilder()
                .setDescription(`🔁 Loop mode set to **${modeStr}**`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()
                .setColor('#00FF00');

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            client.log(`[ERROR] Error in loop command: ${error.message}`);
            return interaction.reply({ content: 'There was an error while trying to set the loop mode!', ephemeral: true });
        }
    },
};
