const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require("./config.json");
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.games = new Discord.Collection();


let gamesFolder = fs.readdirSync('./mini-games'); //return ['hangedman.js','speedtext.js']

for (let folder of gamesFolder) {

    let commandFiles = fs.readdirSync(`./mini-games/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {

        let command = require(`./mini-games/${folder}/${file}`);
        client.commands.set(`${folder} ${command.name}`, command);
        client.games.set(folder, `Mini jeu : ${folder}`);

    }
}

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    console.log(`Commande : ${command}`);
    console.log(`${client.commands.get('speedtext')}`);
    
    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }

});

client.on('ready', () => {

    console.log("client lancé");
    client.user.setActivity("lancé par BoB");

});

const events = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove"
};

client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const {
        d: data
    } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id) || (await user.createDM());

    if (channel.messages.has(data.message_id)) return;

    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    client.emit(events[event.t], reaction, user);
});


client.login(token);