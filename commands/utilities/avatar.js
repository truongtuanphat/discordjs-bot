const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Coi avatar')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Chọn đứa muốn coi avatar')
				.setRequired(false)),

	async execute(interaction) {
		const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
		const userTagged = interaction.options.getUser('user');
		const user = userTagged || interaction.user;

		const avatarEmbed = new EmbedBuilder()
			.setColor(randomColor)
			.setAuthor({ name: user.tag })
			.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({ text: 'avatar như lồn' });

		interaction.reply({ embeds: [avatarEmbed] });
	},
};
