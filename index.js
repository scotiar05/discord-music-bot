// Required Discord.js classes and configuration
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { Player } = require('discord-player');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create a new collection for commands
client.commands = new Collection();
client.player = new Player(client);

// Simple logging function
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Load commands from the commands directory
function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        log(`Loaded command: ${command.data.name}`);
      } else {
        log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    } catch (error) {
      log(`[ERROR] Failed to load command from file ${filePath}`);
      console.error(error);
    }
  }
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  log('Bot is ready!');
  client.user.setActivity('music | /help', { type: ActivityType.Listening });
  loadCommands();
});

// Handle incoming interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    log(`[WARNING] Received unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    log(`[ERROR] Error executing command ${interaction.commandName}`);
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.player.on('trackStart', (queue, track) => {
  queue.metadata.channel.send(`🎶 | Now playing: **${track.title}**`);
});

client.player.on('error', (queue, error) => {
  log(`[ERROR] Player error: ${error.message}`);
  queue.metadata.channel.send('An error occurred while playing music.');
});

// Error handling for the client
client.on('error', error => {
  log(`[ERROR] Client error: ${error.message}`);
});

client.on('warn', warning => {
  log(`[WARN] ${warning}`);
});

// Log in to Discord with your client's token
client.login(token).catch(error => {
  log(`[ERROR] Failed to log in: ${error.message}`);
});
