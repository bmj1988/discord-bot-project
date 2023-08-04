const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('logger')
    .setDescription('Console logs user inputs')
    .addStringOption(option => option.setName('input')
    .setDescription('the words to console log')
    .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        const { option } = interaction;
        const input = option.getString('input')
        console.log(input)
    }
}
