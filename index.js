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
	if (message.content.startsWith('a <@')) {
		const startedPlayer = message.author;
		const opponent = await client.users.fetch(message.content.split(' ')[1].replace(/[<@>]/g, ''));
		let currentPlayerTurn = startedPlayer;

		const caro_1 = new ButtonBuilder()
			.setCustomId('caro_1')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');
		const caro_2 = new ButtonBuilder()
			.setCustomId('caro_2')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');
		const caro_3 = new ButtonBuilder()
			.setCustomId('caro_3')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');

		const caro_4 = new ButtonBuilder()
			.setCustomId('caro_4')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');
		const caro_5 = new ButtonBuilder()
			.setCustomId('caro_5')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');
		const caro_6 = new ButtonBuilder()
			.setCustomId('caro_6')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');

		const caro_7 = new ButtonBuilder()
			.setCustomId('caro_7')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');
		const caro_8 = new ButtonBuilder()
			.setCustomId('caro_8')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');
		const caro_9 = new ButtonBuilder()
			.setCustomId('caro_9')
			.setStyle(ButtonStyle.Secondary)
			.setLabel('-');

		const row_1 = new ActionRowBuilder()
			.addComponents(caro_1, caro_2, caro_3);
		const row_2 = new ActionRowBuilder()
			.addComponents(caro_4, caro_5, caro_6);
		const row_3 = new ActionRowBuilder()
			.addComponents(caro_7, caro_8, caro_9);

		const game = await client.channels.cache.get(message.channelId).send({ content: `❌⭕ **${startedPlayer.displayName}** 🆚 **${opponent.displayName}**\n\nĐi lẹ cmm lên ${startedPlayer}`, components: [row_1, row_2, row_3] });

		const caroButtons = {
			'caro_1': caro_1,
			'caro_2': caro_2,
			'caro_3': caro_3,
			'caro_4': caro_4,
			'caro_5': caro_5,
			'caro_6': caro_6,
			'caro_7': caro_7,
			'caro_8': caro_8,
			'caro_9': caro_9,
		};

		client.on('interactionCreate', async interaction => {
			if (interaction.customId.startsWith('caro_')) {
				if (interaction.user.id === currentPlayerTurn.id && interaction.message.id === game.id) {
					const responseButton = interaction.customId;
					currentPlayerTurn = currentPlayerTurn === startedPlayer ? opponent : startedPlayer;
					if (interaction.user.id === startedPlayer.id) {
						await caroButtons[responseButton].setStyle(ButtonStyle.Primary).setLabel('❌');
					}
					else {
						await caroButtons[responseButton].setStyle(ButtonStyle.Danger).setLabel('⭕');
					}
					await interaction.update({ content: `❌⭕ **${startedPlayer.displayName}** 🆚 **${opponent.displayName}**\n\nĐi lẹ cmm lên ${currentPlayerTurn}`, components: [row_1, row_2, row_3] });
				}
				else if (interaction.user.id !== startedPlayer.id && interaction.user.id !== opponent.id && interaction.message.id === game.id) {
					await interaction.reply({ content: 'Con nít đi chỗ khác chơi', ephemeral: true });
				}
			}
		});
	}
});
