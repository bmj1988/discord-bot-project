const {Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
dotenv.config();
const {Client, Events, GatewayIntentBits} = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageTyping]
});
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration)
// const MDNSearch = require('./commands/mdn.js')
const ping = require('./commands/ping.js')

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
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', incoming)
    function incoming (msg) {
    if (msg.content === 'hi') {
        msg.channel.send('hi there' + msg.content);
    }
    else if (msg.content.startsWith('?')) {
        // async () => {
            console.log(msg.content)
            const completion =  openai.createCompletion({
                model: "text-davinci-003",
                prompt: msg.content,
                max_tokens:2000
            }).then((res) => res.data.choices[0].text).then((res) => msg.reply(res))
            // let response = completion.data.choices[0].text
            // msg.reply(response)
        }
    };

client.login(process.env.DISCORD_TOKEN)
