const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {

	data: new SlashCommandBuilder()
		.setName('chui')
		.setDescription('Chửi mấy đứa vô học')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Chọn đứa muốn chửi')
				.setRequired(false)),

	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reply = target !== null ? `Đụ mẹ bà ${target} 😇` : 'Đụ mẹ mọi người nha 😇';

		await interaction.reply(reply);
		
		if (target?.id === '539403215209496576') {
			await wait(1000);
			await interaction.followUp(`Đụ mẹ bà luôn ${interaction.user} 😏`);
		}
	},
};
