# Discord Music Bot

A feature-rich Discord music bot built with Discord.js.

## Features

- Play music from YouTube
- Queue system
- Volume control
- Pause and resume playback
- Skip songs
- Stop playback and clear queue
- Shuffle queue
- Loop mode (off, song, queue)
- Search YouTube directly
- Easy configuration

## Requirements

- Node.js 16.9.0 or newer
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

- `prefix`: Command prefix (default: '!')
- `token`: Bot token (loaded from environment variable)
- `defaultVolume`: Default volume level (0-100)
- `maxQueueSize`: Maximum number of songs in the queue
- `searchResultLimit`: Number of search results to display
- `searchTimeout`: Timeout for search results (in milliseconds)
- `inactivityTimeout`: Bot leaves voice channel after this duration of inactivity
- `djRole`: Role name required for DJ commands
- `embedColor`: Color for embed messages
- `errorColor`: Color for error messages
- `logLevel`: Logging level
- `messages`: Customizable bot messages

## Commands

- `/play <song>`: Play a song or add it to the queue
- `/pause`: Pause the current song
- `/resume`: Resume playback
- `/stop`: Stop playback and clear the queue
- `/skip`: Skip the current song
- `/queue`: Display the current queue
- `/volume <0-100>`: Adjust the volume
- `/shuffle`: Shuffle the queue
- `/loop <off|song|queue>`: Set loop mode
- `/search <query>`: Search for a song on YouTube
- `/nowplaying`: Display information about the currently playing song
- `/remove <position>`: Remove a song from the queue
- `/move <from> <to>`: Move a song to a different position in the queue
- `/repeat <off|song|queue>`: Set repeat mode
- `/restart`: Restart the current song
- `/playnext <song>`: Add a song to play next in the queue
- `/clear`: Clear the entire queue
- `/seek <time>`: Seek to a specific time in the current song
- `/forceskip`: Force skip the current song (admin only)
- `/skipto <position>`: Skip to a specific position in the queue
- `/grab`: Save the current song to your DMs
- `/lyrics`: Display lyrics for the current song

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## How to Contribute

Contributions are welcome! Please feel free to submit a Pull Request.
