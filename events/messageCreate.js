require('dotenv').config();
const { Events, userMention } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const isBotMessage = message.author.id === process.env.APP_ID;
    const content = message.content.toLowerCase();

    // đụ
    if (content.includes('đụ') && !isBotMessage) {
      message.reply('chửi thề con cặc');
    }

    // hello, hé lô
    if ((content.includes('hello') || content.includes('hé lô') || content.includes('hélô')) && !isBotMessage) {
      message.reply('lô con cặc');
    }

    // test
    if (content === 'a' && !isBotMessage) {
      console.log(message)
      message.reply(userMention(message.author.id))
    }
  },
};