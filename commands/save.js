const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('save')
        .setDescription('Save the current song or playlist to your personal list')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name for the saved item')
                .setRequired(true)),

    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
        }

        const name = interaction.options.getString('name');
        const userId = interaction.user.id;
        const currentTrack = queue.current;
        const playlist = queue.tracks.map(track => ({
            title: track.title,
            url: track.url,
            duration: track.duration,
            thumbnail: track.thumbnail
        }));

        const saveData = {
            name: name,
            currentTrack: {
                title: currentTrack.title,
                url: currentTrack.url,
                duration: currentTrack.duration,
                thumbnail: currentTrack.thumbnail
            },
            playlist: playlist
        };

        const savePath = path.join(__dirname, '..', 'data', 'saved');
        if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath, { recursive: true });
        }

        const filePath = path.join(savePath, `${userId}.json`);
        let userData = {};

        if (fs.existsSync(filePath)) {
            userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        userData[name] = saveData;

        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Saved Successfully')
            .setDescription(`Saved current song and playlist as "${name}"`)
            .addFields(
                { name: 'Current Song', value: currentTrack.title },
                { name: 'Playlist Length', value: playlist.length.toString() }
            )
            .setColor('#00FF00')
            .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
