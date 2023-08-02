const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
module.exports = {
    name: 'Loop',
	data: new SlashCommandBuilder()
		.setName('loop')	
		.setDescription('loop the music/ลูป เพลง')
		.addStringOption(options =>
			options.setName('mode')
				.setDescription('0 ปิดลูป/1 ลูปเพลงนี้/2 ลูปคิวเพลง/3 ลูปเพลงและรายการเพลง')
				.setRequired(true)),
	async execute(interaction) {
		const mode = interaction.options.getString('mode');
		parseInt(mode);
		if (!mode) return await interaction.reply({
			content: 'Please specify a loop mode!',
			ephemeral: true,
		});
		if (!interaction.member.voice.channelId) return await interaction.reply({
			content: 'You are not in a voice channel!',
			ephemeral: true,
		});
		//check if mode is int and between 0 and 3
		if (isNaN(mode) || ![0, 1, 2, 3].includes(parseInt(mode))) return await interaction.reply({
			content: 'Please specify a valid loop mode!',
			ephemeral: true,
		});
		
		const queue = useQueue(interaction.guild.id);
		queue.setRepeatMode(mode);
		await interaction.reply({
			content: `🔁 | Loop mode set to **${mode}**!`,
		});
	},
};
