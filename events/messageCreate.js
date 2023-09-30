require('dotenv').config();
const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
    async execute(message) {
    const isBotMessage = message.author.id === process.env.APP_ID;
    const content = message.content.toLowerCase();

    if (content.includes('đụ') && !isBotMessage){
      return message.reply('chửi thề con cặc');
    }
	},
};