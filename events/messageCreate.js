const { Events } = require('discord.js');

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
	},
};
