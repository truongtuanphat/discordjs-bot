require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const app = express();
const token = process.env.DISCORD_TOKEN;
const port = 3000;

app.get('/', function(req, res) {
	res.send(`Server started on port ${port}`);
});

app.listen(port);
console.log(`Server started on port ${port}`);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

// #########################	test	#########################

client.on('messageCreate', async message => {
	const content = message.content.toLowerCase();
	console.log(message.author.bot)

	if (content === 'a') {

		const button = new ButtonBuilder()
			.setCustomId('welcome_button')
			.setLabel('Thằng lồn nào đây')
			.setStyle(ButtonStyle.Secondary)
			.setEmoji('🤔');

		const row = new ActionRowBuilder()
			.addComponents(button);

		message.reply({ components: [row] });

		client.on('interactionCreate', async interaction => {
			if (interaction.customId === 'welcome_button') {
				const rowtest = new ActionRowBuilder().addComponents(interaction.component);
				console.log('rowtest', interaction.component);
				const buttonbuilder = new ButtonBuilder(interaction.component.data);
				console.log('buttonbuilder', buttonbuilder);
				buttonbuilder.setDisabled(true);
				rowtest.setComponents(buttonbuilder);


				interaction.update({ components: [rowtest] }).catch(() => {
					console.log('[--INFO--] Someone try to spam on welcome button');
				});
				interaction.message.react('🤔');
			}
		});
	}
});
