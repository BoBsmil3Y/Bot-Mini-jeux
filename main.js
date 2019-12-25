const Discord = require('discord.js');
const configFile = require("./json/config.json");
const client = new Discord.Client();
const prefix = configFile.prefix;
const token = configFile.prefix;


client.on('ready', () => {

  console.log("client lancé");
  client.user.setActivity("oui");

});


client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
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