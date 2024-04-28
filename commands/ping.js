const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'Ping',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		//Check Latency of the bot
		await interaction.reply(`Pong! ${Date.now() - interaction.createdTimestamp}ms`);
	},
};
