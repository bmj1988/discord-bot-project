/// NODE
const fs = require('node:fs');
const path = require('node:path');
/// DOTENV
const dotenv = require('dotenv');
dotenv.config();
//// Discord API
const {Client, Events, Collection, GatewayIntentBits} = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageTyping]
});
/// OpenAI API
const {Configuration, OpenAIApi } = require("openai");
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
// const MDNSearch = require('./commands/mdn.js')
const ping = require('./commands/fun/ping.js')

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
/// MESSAGE HANDLING
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

/// SLASH HANDLER

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command: ${interaction.commandName} could be found.`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Could not execute command.', ephemeral: true })
        }
        else {
            await interaction.reply({ content: 'Could not execute command.', ephemeral: true })
        }
    }
    });

client.login(process.env.DISCORD_TOKEN)
