/// NODE
const fs = require('node:fs');
const path = require('node:path');
/// DOTENV
const dotenv = require('dotenv').config();
//// Discord API
const { Client, Events, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageTyping]
});
/// OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration)
/// SLASHERS
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}
/// EVENTS PATH
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
////
 const mdn = require('./testing/mdn.js')
//chatgpt client section

// async function jupiter() {
//     const completion = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: "What is jupiter made of?",
//         max_tokens:2000
//     })
//     console.log(completion.data.choices[0].text)
// }

// //send a message, wait for response
// let res = await api.sendMessage('What is jupiter made of?')
// console.log(res.text)

// //send a follow-up

// res = await api.sendMessage('Tell me more about that, please', {
//     parentMessageId: res.id
// })
// console.log(res.text)

// res= await api.sendMessage('What were we talking about?', {
//     parentMessageId: res.id
// })
// console.log(res.text)
// jupiter();

// DISCORD client section
/// MESSAGE HANDLING
client.on('messageCreate', incoming)
async function incoming(msg) {
    if (msg.content === 'hi') {
        msg.channel.send('hi there' + msg.content);
    }
    else if (msg.content.startsWith('?')) {
        console.log(msg.content)
        const completion = openai.createCompletion({
            model: "text-davinci-003",
            prompt: msg.content,
            max_tokens: 2000
        }).then((res) => res.data.choices[0].text).then((res) => msg.reply(res))
        // let response = completion.data.choices[0].text
        // msg.reply(response)
    }
    else if (msg.content.startsWith('mdn')) {
        const searchString = msg.content.split(' ').slice(1).join(' ')
        const results = await mdn(searchString)
        msg.reply({embeds: [results]})
    }
};
client.login(process.env.DISCORD_TOKEN)
