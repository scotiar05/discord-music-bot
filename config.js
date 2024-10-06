module.exports = {
    // Bot configuration
    prefix: '!',
    token: process.env.BOT_TOKEN,

    // Music configuration
    defaultVolume: 50,
    maxQueueSize: 100,
    searchResultLimit: 5,

    // Timeout configuration (in milliseconds)
    searchTimeout: 60000,
    inactivityTimeout: 300000, // 5 minutes

    // Permissions
    djRole: 'DJ',

    // Embed colors
    embedColor: '#0099ff',
    errorColor: '#ff0000',

    // Logging
    logLevel: 'info',

    // Custom messages
    messages: {
        notInVoiceChannel: 'You need to be in a voice channel to use this command!',
        noPermission: 'You do not have permission to use this command.',
        queueEmpty: 'The queue is currently empty.',
        songAdded: 'Added to queue: ',
        songSkipped: 'Skipped the current song.',
        volumeChanged: 'Volume set to ',
    },
};
