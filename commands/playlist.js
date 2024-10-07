const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const PLAYLISTS_DIR = path.join(__dirname, '..', 'playlists');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Manage and play playlists')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new playlist')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name of the playlist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a song to a playlist')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('The name of the playlist')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('The song to add')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a song from a playlist')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('The name of the playlist')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('index')
                        .setDescription('The index of the song to remove')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all playlists or songs in a playlist')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('The name of the playlist')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Play a playlist')
                .addStringOption(option =>
                    option.setName('playlist')
                        .setDescription('The name of the playlist')
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'create':
                await this.createPlaylist(interaction);
                break;
            case 'add':
                await this.addToPlaylist(interaction);
                break;
            case 'remove':
                await this.removeFromPlaylist(interaction);
                break;
            case 'list':
                await this.listPlaylists(interaction);
                break;
            case 'play':
                await this.playPlaylist(interaction);
                break;
            default:
                await interaction.reply({ content: 'Invalid subcommand!', ephemeral: true });
        }
    },

    async createPlaylist(interaction) {
        const playlistName = interaction.options.getString('name');
        const filePath = path.join(PLAYLISTS_DIR, `${playlistName}.json`);

        try {
            await fs.access(filePath);
            return interaction.reply({ content: 'A playlist with this name already exists!', ephemeral: true });
        } catch {
            await fs.writeFile(filePath, '[]');
            return interaction.reply({ content: `Playlist "${playlistName}" created successfully!`, ephemeral: true });
        }
    },

    async addToPlaylist(interaction) {
        const playlistName = interaction.options.getString('playlist');
        const song = interaction.options.getString('song');
        const filePath = path.join(PLAYLISTS_DIR, `${playlistName}.json`);

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const playlist = JSON.parse(data);
            playlist.push(song);
            await fs.writeFile(filePath, JSON.stringify(playlist));
            return interaction.reply({ content: `Added "${song}" to playlist "${playlistName}"!`, ephemeral: true });
        } catch {
            return interaction.reply({ content: 'Playlist not found!', ephemeral: true });
        }
    },

    async removeFromPlaylist(interaction) {
        const playlistName = interaction.options.getString('playlist');
        const index = interaction.options.getInteger('index') - 1;
        const filePath = path.join(PLAYLISTS_DIR, `${playlistName}.json`);

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const playlist = JSON.parse(data);
            if (index < 0 || index >= playlist.length) {
                return interaction.reply({ content: 'Invalid song index!', ephemeral: true });
            }
            const removedSong = playlist.splice(index, 1)[0];
            await fs.writeFile(filePath, JSON.stringify(playlist));
            return interaction.reply({ content: `Removed "${removedSong}" from playlist "${playlistName}"!`, ephemeral: true });
        } catch {
            return interaction.reply({ content: 'Playlist not found!', ephemeral: true });
        }
    },

    async listPlaylists(interaction) {
        const playlistName = interaction.options.getString('playlist');

        if (playlistName) {
            const filePath = path.join(PLAYLISTS_DIR, `${playlistName}.json`);
            try {
                const data = await fs.readFile(filePath, 'utf8');
                const playlist = JSON.parse(data);
                const embed = new EmbedBuilder()
                    .setTitle(`Playlist: ${playlistName}`)
                    .setDescription(playlist.map((song, index) => `${index + 1}. ${song}`).join('\n'))
                    .setColor('#0099ff');
                return interaction.reply({ embeds: [embed] });
            } catch {
                return interaction.reply({ content: 'Playlist not found!', ephemeral: true });
            }
        } else {
            try {
                const files = await fs.readdir(PLAYLISTS_DIR);
                const playlists = files.filter(file => file.endsWith('.json')).map(file => file.slice(0, -5));
                const embed = new EmbedBuilder()
                    .setTitle('Available Playlists')
                    .setDescription(playlists.join('\n'))
                    .setColor('#0099ff');
                return interaction.reply({ embeds: [embed] });
            } catch {
                return interaction.reply({ content: 'Error reading playlists!', ephemeral: true });
            }
        }
    },

    async playPlaylist(interaction) {
        const playlistName = interaction.options.getString('playlist');
        const filePath = path.join(PLAYLISTS_DIR, `${playlistName}.json`);

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const playlist = JSON.parse(data);

            if (playlist.length === 0) {
                return interaction.reply({ content: 'The playlist is empty!', ephemeral: true });
            }

            const { channel } = interaction.member.voice;
            if (!channel) {
                return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
            }

            const queue = interaction.client.player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });

            try {
                if (!queue.connection) await queue.connect(channel);
            } catch {
                queue.destroy();
                return interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
            }

            await interaction.reply(`Loading playlist: ${playlistName}`);

            for (const song of playlist) {
                const result = await interaction.client.player.search(song, {
                    requestedBy: interaction.user
                });

                if (result.tracks.length === 0) continue;

                const track = result.tracks[0];
                queue.addTrack(track);
            }

            if (!queue.playing) await queue.play();

        } catch {
            return interaction.reply({ content: 'Playlist not found or error occurred while playing!', ephemeral: true });
        }
    }
};
