const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {

	data: new SlashCommandBuilder()
		.setName('chui')
		.setDescription('Chửi mấy đứa vô học')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Chọn đứa muốn chửi')
				.setRequired(false)),

	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reply = user !== null ? `Đụ mẹ bà ${user} 😇` : 'Đụ mẹ mọi người nha 😇';

		await interaction.reply(reply);

		if (user?.id === '539403215209496576') {
			await wait(1000);
			await interaction.followUp(`Đụ mẹ bà luôn ${interaction.user} 😏`);
		}
	},
};
