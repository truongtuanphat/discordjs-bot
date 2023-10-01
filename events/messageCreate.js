const { Events, userMention } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const isBotMessage = message.author.id === process.env.APP_ID;
    if (isBotMessage) return

    const content = message.content.toLowerCase();

    // đụ
    if (content.includes('đụ')) {
      const words = content.split(' ')
      words.forEach(word => {
        if (word === 'đụ') {
          message.reply('chửi thề con cặc');
        }
      })
    }

    // hello | hé lô
    if ((content.includes('hello') || content.includes('hé lô') || content.includes('hélô'))) {
      message.reply('lô con cặc');
    }

    // test
    if (content === 'a') {
      console.log(message.author)
      message.reply(`${userMention(message.author.id)}`)
    }
  },
};