const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
  once: true,
	async execute(message) {
		console.log(message.content)
    message.reply('chửi thề con cặc')
	},
};