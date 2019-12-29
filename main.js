const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require("./json/config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.miniJeux = new Discord.Collection();

const miniJeuxFolder = fs.readdirSync('./mini-games')


for (const folder of miniJeuxFolder) {
    const commandFiles = fs.readdirSync(`./mini-games/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./mini-games/${folder}/${file}`);
        client.commands.set(`${folder} ${command.name}`, command);
        client.miniJeux.set(folder, `Mini jeu : ${folder}`)
    }
}

console.log(client.miniJeux)
console.log(client.commands)

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const commande = msg.content.toLowerCase()
    const args = commande.slice(prefix.length)

    const command = client.commands.get(args);

    console.log(command)

    try {
        console.log(`Commandes : ${client.commands}`)
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }

});

client.on('ready', () => {

    console.log("client lancé");
    client.user.setActivity("oui");

});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.id === client.user.id) return;

    let commandFile = require(`./handler/reactionIdea.js`);
    commandFile.run(l, Discord, client, reaction, user);

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