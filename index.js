// Required Discord.js classes and configuration
const { Client, GatewayIntentBits, Collection } = require('discord.js');
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

// Read command files from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load all command files
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Bot is ready!');
});

// Handle incoming interactions
client.on('interactionCreate', async interaction => {
  // If the interaction isn't a command, ignore it
  if (!interaction.isCommand()) return;

  // Get the command from the client.commands collection
  const command = client.commands.get(interaction.commandName);

  // If the command doesn't exist, ignore it
  if (!command) return;

  try {
    // Execute the command
    await command.execute(interaction);
  } catch (error) {
    // Log any errors and send an error message
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Log in to Discord with your client's token
client.login(token);
