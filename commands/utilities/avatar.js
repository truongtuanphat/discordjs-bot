const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Coi avatar')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Chọn đứa muốn coi avatar')
				.setRequired(false)),

	async execute(interaction) {
		const userTagged = interaction.options.getUser('target');
		const target = userTagged || interaction.user;	
		const avatarEmbed = new EmbedBuilder()
			.setImage(target.displayAvatarURL({ dynamic: true }))
			.setFooter({ text: 'như lồn' });

		interaction.reply({ embeds: [avatarEmbed] });
	},
};
