const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { queues } = require('./queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The YouTube URL or search query of the song to play')
                .setRequired(true)),

    async execute(interaction) {
        const song = interaction.options.getString('song');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command!');
        }

        try {
            let queue = queues.get(interaction.guild.id);
            if (!queue) {
                queue = new (require('../utils/queue'))();
                queues.set(interaction.guild.id, queue);
            }

            const songInfo = await ytdl.getInfo(song);
            const songData = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };

            queue.add(songData);

            if (queue.getQueue().length === 1 && !queue.getCurrentSong()) {
                await playSong(interaction, queue);
            } else {
                await interaction.reply(`Added to queue: ${songData.title}`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};

async function playSong(interaction, queue) {
    const song = queue.next();
    if (!song) {
        return interaction.reply('No songs in the queue!');
    }

    const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const stream = ytdl(song.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
        playSong(interaction, queue);
    });

    await interaction.reply(`Now playing: ${song.title}`);
}
