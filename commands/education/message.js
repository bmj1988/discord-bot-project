const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Testing'),
	async execute(interaction) {
		await interaction.reply(console.log(interaction.message));
	},
};
