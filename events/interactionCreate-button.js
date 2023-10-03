const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'welcome_button') {
      const row = new ActionRowBuilder().addComponents(interaction.component);
      const button = new ButtonBuilder(interaction.component.data);

      button.setStyle(ButtonStyle.Primary)
      button.setDisabled(true);
      row.setComponents(button);
      
      interaction.update({ components: [row] }).catch(() => {
        console.log('[--INFO--] Someone is trying to spam on welcome button');
      });
      
      interaction.message.react('🤔');
    }
  },
};