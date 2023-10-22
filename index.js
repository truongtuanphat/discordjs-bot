require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const app = express();
const token = process.env.DISCORD_TOKEN;
const port = 3000;

app.get('/', function (req, res) {
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
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

// #########################	test	#########################

client.on('messageCreate', async (message) => {
	if (message.content.startsWith('a <@')) {
		const startedPlayer = message.author;
		const opponent = await client.users.fetch(message.content.split(' ')[1].replace(/[<@>]/g, ''));
		let currentPlayerTurn = startedPlayer;

		// Create the game board buttons
		const caroButtons = {};
		const rowComponents = [];

		for (let i = 1; i <= 9; i++) {
			const customId = `caro_${i}`;
			const caroButton = new ButtonBuilder().setCustomId(customId).setStyle(ButtonStyle.Secondary).setLabel('-');
			caroButtons[customId] = caroButton;

			if (i % 3 === 1) {
				rowComponents.push(new ActionRowBuilder());
			}
			rowComponents[rowComponents.length - 1].addComponents(caroButton);
		}

		const game = await client.channels.cache.get(message.channelId).send({
			content: `❌ **${startedPlayer.displayName}**\n\t\t🆚\n⭕ **${opponent.displayName}**\n\nĐi lẹ cmm lên ${currentPlayerTurn}`,
			components: rowComponents,
		});

		const invalidButtons = [];

		client.on('interactionCreate', async (interaction) => {
			if (interaction.customId.startsWith('caro_') && interaction.message.id === game.id) {
				const responseButton = interaction.customId;
				const defaultContent = `❌ **${startedPlayer.displayName}**\n\t\t🆚\n⭕ **${opponent.displayName}**\n\n`;

				if (
					interaction.user.id === currentPlayerTurn.id &&
					!invalidButtons.includes(responseButton) &&
					!invalidButtons.includes('END')
				) {
					currentPlayerTurn = currentPlayerTurn === startedPlayer ? opponent : startedPlayer;
					if (interaction.user.id === startedPlayer.id) {
						await caroButtons[responseButton].setStyle(ButtonStyle.Primary).setLabel('❌');
					} else {
						await caroButtons[responseButton].setStyle(ButtonStyle.Danger).setLabel('⭕');
					}
					invalidButtons.push(responseButton);

					let board = [
						[caroButtons.caro_1.data.label, caroButtons.caro_2.data.label, caroButtons.caro_3.data.label],
						[caroButtons.caro_4.data.label, caroButtons.caro_5.data.label, caroButtons.caro_6.data.label],
						[caroButtons.caro_7.data.label, caroButtons.caro_8.data.label, caroButtons.caro_9.data.label],
					];

					if (checkForWinner(board)) {
						await interaction.update({
							content: `${defaultContent}${interaction.user} thắng 🎉`,
							components: rowComponents,
						});
						invalidButtons.push('END');
					} else if (draw(board)) {
						await interaction.update({
							content: `${defaultContent}Hòa`,
							components: rowComponents,
						});
					} else {
						await interaction.update({
							content: `${defaultContent}Đi lẹ cmm lên ${currentPlayerTurn}`,
							components: rowComponents,
						});
					}
				} else if (interaction.user.id !== startedPlayer.id && interaction.user.id !== opponent.id) {
					await interaction.reply({ content: 'Con nít đi chỗ khác chơi', ephemeral: true });
				}
			}
		});
	}
});

function checkForWinner(board) {
	// Check rows, columns, and diagonals for a winning condition
	for (let i = 0; i < 3; i++) {
		if (
			(board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '-') || // Check rows
			(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '-') // Check columns
		) {
			return true;
		}
	}
	if (
		(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '-') || // Check diagonal (top-left to bottom-right)
		(board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '-') // Check diagonal (top-right to bottom-left)
	) {
		return true;
	}

	return false;
}

function draw(board) {
	let flag = true;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i][j] === '-') {
				flag = false;
			}
		}
	}
	return flag;
}
