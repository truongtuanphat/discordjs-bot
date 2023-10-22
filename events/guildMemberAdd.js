const { Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		const user = member.user;
		const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

		const welcomeEmbed = new EmbedBuilder()
			.setColor(randomColor)
			.setTitle('Hé lô mấy cưng')
			.setDescription(`Spy tới chơi ${user}`)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({ text: 'avatar như lồn' });

		const button = new ButtonBuilder()
			.setCustomId('welcome_button')
			.setLabel('Thằng lồn nào đây')
			.setStyle(ButtonStyle.Secondary)
			.setEmoji('🤔');

		const row = new ActionRowBuilder()
			.addComponents(button);

		member.client.channels.cache.get(process.env.WELCOME_CHANNEL_ID).send({ embeds: [welcomeEmbed], components: [row] });
	},
};