const { SlashCommandBuilder } = require('discord.js');
const TicTacToe = require('discord-tictactoe');

module.exports = {
	data: new SlashCommandBuilder().setName('caro').setDescription('Cờ caro 3x3'),

	async execute(interaction) {
		const game = new TicTacToe({ language: 'en', commandOptionName: 'user' });
		game.handleInteraction(interaction);
	},
};
