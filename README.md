# Discord Music Bot

A feature-rich Discord music bot built with Discord.js v14 and Node.js.

## Features

- Play music from YouTube
- Advanced queue system with pagination
- Volume control
- Pause and resume playback
- Skip songs (including force skip for admins)
- Stop playback and clear queue
- Shuffle queue
- Loop mode (off, track, queue)
- Search YouTube directly
- Lyrics lookup
- Seek within tracks
- Move and remove songs in the queue
- Display now playing information
- Save current song to DMs
- Easy configuration through environment variables and config file

## Requirements

- Node.js 20.17.0 or newer
- Discord.js v14
- FFmpeg

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/discord-music-bot.git
   ```

2. Install dependencies:
   ```
   cd discord-music-bot
   npm install
   ```

3. Create a `.env` file in the root directory and add your Discord bot token:
   ```
   BOT_TOKEN=your_bot_token_here
   ```

4. Configure the bot in `config.js` (see Configuration section below).

5. Start the bot:
   ```
   npm start
   ```

## Configuration

You can easily configure the bot by editing the `config.js` file. Here are the available options:

- `clientId`: Your bot's client ID (required for slash command registration)
- `guildId`: Your server's ID (for development, remove for global commands)
- `token`: Bot token (loaded from environment variable)
- `defaultVolume`: Default volume level (0-100)
- `maxQueueSize`: Maximum number of songs in the queue
- `searchResultLimit`: Number of search results to display
- `embedColor`: Color for embed messages

Additionally, you can configure logging levels and other options in the `index.js` file.

## Commands

All commands are implemented as slash commands. Here's a list of available commands:

- `/play <song>`: Play a song or add it to the queue
- `/pause`: Pause the current song
- `/resume`: Resume playback
- `/stop`: Stop playback and clear the queue
- `/skip`: Skip the current song
- `/queue [page]`: Display the current queue with pagination
- `/volume <0-100>`: Adjust the volume
- `/shuffle`: Shuffle the queue
- `/loop <off|track|queue>`: Set loop mode
- `/search <query>`: Search for a song on YouTube
- `/nowplaying`: Display information about the currently playing song
- `/remove <position>`: Remove a song from the queue
- `/move <from> <to>`: Move a song to a different position in the queue
- `/seek <time>`: Seek to a specific time in the current song
- `/forceskip`: Force skip the current song (admin only)
- `/skipto <position>`: Skip to a specific position in the queue
- `/grab`: Save the current song to your DMs
- `/lyrics`: Display lyrics for the current song

## Error Handling and Logging

The bot includes comprehensive error handling and logging. Errors are logged to the console and, where appropriate, sent as ephemeral messages to users. This helps in quick debugging and maintaining a smooth user experience.

## Maintainability

The bot's code is structured for easy maintenance:

- Commands are modularized in separate files in the `commands` directory
- Common utilities are separated into a `utils` directory
- The main bot logic is contained in `index.js`
- Configuration is centralized in `config.js`

To add new commands, simply create a new file in the `commands` directory following the existing command structure.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
