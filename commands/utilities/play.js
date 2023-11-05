const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder().setName('play').setDescription('Plays audio in the music VC'),
	async execute(interaction) {
		const voiceChannelId = '1170033232327217233';
		const voiceChannel = interaction.client.channels.cache.get(voiceChannelId);
		const guildId = '752524758784147477';

		const player = createAudioPlayer();

		player.on('error', (error) => {
			console.error(`Error: ${error.message} with resource`);
		});

		const resource = createAudioResource('test.mp3');
		player.play(resource);

		const connection = joinVoiceChannel({
			channelId: voiceChannelId,
			guildId: guildId,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
		});

		interaction.reply({ content: 'ok', ephemeral: true });

		const subscription = connection.subscribe(player);
		if (subscription) {
			setTimeout(() => subscription.unsubscribe(), 300000);
		}
	},
};
