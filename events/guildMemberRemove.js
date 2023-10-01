const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const user = member.user;
    member.client.channels.cache.get(process.env.FAREWELL_CHANNEL_ID).send(`cút mẹ mày đi ${user}`)
  },
};