const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bopdit')
		.setDescription('Bóp đít')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Chọn đứa muốn bóp đít')
				.setRequired(true)),
	/**
	* @param {import('discord.js').Interaction} interaction
	*/
	async execute(interaction) {
		const gifList = [
			'https://media.tenor.com/FSI2WWHS8oMAAAAi/tkthao219-bubududu.gif',
			'https://tenor.com/view/tkthao219-bubududu-panda-gif-21655886',
		]
		const randomGif = gifList[getRandomInt(gifList.length)]
		const target = interaction.options.getUser('target');
		const reply = `${interaction.user} bóp đít ${target} 🤤`;

		await interaction.reply(reply);
		await interaction.followUp(randomGif);
	},
};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
