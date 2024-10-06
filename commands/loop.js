const { SlashCommandBuilder } = require('@discordjs/builders');
const { queues } = require('./queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle loop mode')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Song', value: 'song' },
                    { name: 'Queue', value: 'queue' }
                )),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const queue = queues.get(guildId);

        if (!queue || queue.isEmpty()) {
            return interaction.reply('There is nothing playing.');
        }

        const mode = interaction.options.getString('mode');

        switch (mode) {
            case 'off':
                queue.setLoopMode('off');
                await interaction.reply('Loop mode is now off.');
                break;
            case 'song':
                queue.setLoopMode('song');
                await interaction.reply('Now looping the current song.');
                break;
            case 'queue':
                queue.setLoopMode('queue');
                await interaction.reply('Now looping the entire queue.');
                break;
        }
    },
};
