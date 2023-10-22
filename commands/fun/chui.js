const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chui')
		.setDescription('Chửi mấy đứa vô học')
		.addUserOption((option) => option.setName('user').setDescription('Chọn đứa muốn chửi').setRequired(false)),

	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reply = user !== null ? `Đụ mẹ bà ${user} 😇` : 'Đụ mẹ mọi người nha 😇';
		const isMe = user?.id === process.env.MY_ID;
		const isMyBot = user?.id === process.env.APP_ID;

		await interaction.reply(reply);

		if (isMe) {
			await wait(1000);
			await interaction.followUp(`Đụ mẹ bà luôn ${interaction.user} 😏`);
		}

		if (isMyBot) {
			await wait(1000);
			await interaction.followUp('Khùng hả má, hết đứa để chửi hay gì 😡');
		}
	},
};
