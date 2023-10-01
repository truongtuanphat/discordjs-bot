const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const user = member.user;
    const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

    const welcomeEmbed = new EmbedBuilder()
      .setColor(randomColor)
      .setTitle(`Hé lô mấy cưng`)
      .setDescription(`Spy tới chơi ${user}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setFooter({ text: 'avatar như lồn' });

    member.client.channels.cache.get(process.env.WELCOME_CHANNEL_ID).send({ embeds: [welcomeEmbed] })
  },
};