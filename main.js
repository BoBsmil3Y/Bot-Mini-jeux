const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require("./json/config.json");


const client = new Discord.Client();
client.commands = new Discord.Collection();

//Get all games directory and files with command inside.
const folders = fs.readdirSync('./games');

for (let folder of folders) {

    const commandFiles = fs.readdirSync(`./games/${folder}`).filter(file => file.endsWith('.js'));

    for (let commands of commandFiles) {
        
        const command = require(`./games/${folder}/${commands}`);
        if (command.name) client.commands.set(command.name, command); 

    }
    
}

//Launching files with appropriate commands
client.on('message', message => {
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).toLowerCase().split(/ +/);
    const command = args.shift();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(Discord, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
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