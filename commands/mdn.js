const axios = require('axios')
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mdn')
    .setDescription('MDN Search'),

    category: "Search",
    description: 'Searches official MDN documention',

    slash: 'both',

    minArgs: 1,
    expectedArgs: '<search-query>',

    callback: async ({text}) => {
        const base = 'https://developer.mozilla.org'
        const uri = `${base}/api/v1/search?=${encodeURIComponent(
            text
        )}&locale=en-US`

        const docs = (await axios(uri)).data.documents

        if (documents) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: `MDN`,
                    iconURL: `https://avatars.githubusercontent.com/u/7565578?s=200&v=4`
                })
            let truncated = false;
            if (documents > 3) {
                documents.length = 3
                truncated = true
            }
            for (let {mdn_url, title, summary} of documents) {
                summary = summary.replace(/(\r\n|\n|\r)/gm, '')

                embed.addField(title, `${summary}\n[**Link**](${base}${mdn_url})`)
            }
            if (truncated) {
                embed.addField(
                    'Your search had more results than I am capable of displaying here.',
                    `View the additional search results [here](https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(text)}).`
                )
            }
            return embed
        }
        return `Could not find an appropriate search result.`
    },
}
