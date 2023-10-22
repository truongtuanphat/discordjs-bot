const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bopdit')
		.setDescription('Bóp đít')
		.addUserOption((option) => option.setName('user').setDescription('Chọn đứa muốn bóp đít').setRequired(true)),

	async execute(interaction) {
		const gifList = [
			'https://media.tenor.com/FSI2WWHS8oMAAAAi/tkthao219-bubududu.gif',
			'https://tenor.com/view/tkthao219-bubududu-panda-gif-21655886',
		];
		const randomGif = gifList[Math.floor(Math.random() * gifList.length)];
		const user = interaction.options.getUser('user');
		const reply = `${interaction.user} bóp đít ${user} 🤤`;

		await interaction.reply(reply);
		await interaction.followUp(randomGif);
	},
};
