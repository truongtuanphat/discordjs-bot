const { Events, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// log
		console.log(`${message.author.displayName}: ${message.content}`);

		const isBotMessage = message.author.bot;
		if (isBotMessage) return;

		const content = message.content.toLowerCase();

		// đụ
		if (content.includes('đụ')) {
			const words = content.split(' ');
			words.forEach((word) => {
				if (word === 'đụ') {
					message.reply('chửi thề con cặc');
				}
			});
		}

		// hello | hé lô
		if (content.includes('hello') || content.includes('hé lô') || content.includes('hélô')) {
			message.reply('lô con cặc');
		}

		// caro game
		if (message.content.startsWith('.caro <@')) {
			const startedPlayer = message.author;
			const opponent = await message.client.users.fetch(message.content.match(/<@(\d+)>/)[1]);
			console.log(opponent);
			const defaultContent = `❌ **${startedPlayer.displayName}** 🆚 **${opponent.displayName}** ⭕\n\n`;
			let currentPlayerTurn = startedPlayer;

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

			const caroGame = await message.client.channels.cache.get(message.channelId).send({
				content: `${defaultContent}Đi lẹ cmm lên ${currentPlayerTurn}`,
				components: rowComponents,
			});

			const invalidButtons = [];

			message.client.on('interactionCreate', async (interaction) => {
				if (interaction.customId.startsWith('caro_') && interaction.message.id === caroGame.id) {
					const responseButton = interaction.customId;

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
	},
};

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
