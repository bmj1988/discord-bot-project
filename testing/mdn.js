const axios = require('axios')
const {EmbedBuilder} = require('discord.js')

 module.exports = async function mdn(searchString) {
   const base = `https://developer.mozilla.org`
   const uri = `${base}/api/v1/search?q=${encodeURIComponent(searchString)}&locale=en-US`

   const documents = (await axios(uri)).data.documents[0]

   if (documents) {
      const embed = new EmbedBuilder()
         .setAuthor({
            name: `MDN Docs`,
            iconURL: `https://avatars.githubusercontent.com/u/7565578?s=200&v=4`,
         })
         .setTitle(documents.title)
         .setDescription(documents.summary)
         .setURL(base+documents.mdn_url)
         .setTimestamp()
         return embed
   }
   return documents.summary
 }
