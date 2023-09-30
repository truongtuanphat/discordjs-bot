const { Events, EmbedBuilder, userMention } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const user = member.user;
    const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

    console.log('add', user);

    const welcomeEmbed = new EmbedBuilder()
      .setColor(randomColor)
      .setTitle(`Hé lô mấy cưng`)
      .setDescription(`Spy tới chơi ${userMention(user.id)}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({ text: 'avatar như lồn' });

    member.client.channels.cache.get(process.env.WELCOME_CHANNEL_ID).send({ embeds: [welcomeEmbed] })
  },
};