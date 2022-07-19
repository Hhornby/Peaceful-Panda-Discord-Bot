const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const { Token, FrontDoor, RulesID, SupportID } = require("./config.json");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
  partials: ["CHANNEL"],
});

client.commands = new Collection();
const prefix = "!";
const fs = require("fs");
const commandfiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandfiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

function GetDateStamp() {
  const d = new Date(Date.now());
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const date = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  date_stamp = `${hours}:${minutes}:${seconds} | ${date}-${month}-${year}`;
  return date_stamp;
}

client.once("ready", () => {
  console.log("Bot is online!");
  client.user.setPresence({
    activities: [
      {
        name: "Foxes",
        type: "WATCHING", // WATCHING | PLAYING | STREAMING | LISTENING
      },
    ],
    status: "online",
  });
});

// When a person joins the discord
client.on("guildMemberAdd", (member) => {
  const channel = client.channels.cache.get(FrontDoor);
  const rules_channel = client.channels.cache.get(RulesID);
  const addEmbed = new MessageEmbed();
  addEmbed.setColor("#8000FF");
  addEmbed.setTitle(`${member.user.tag} Joined`);
  addEmbed.setAuthor({
    name: member.user.tag,
    iconURL: member.user.avatarURL(),
  });
  addEmbed.setDescription(
    `${member.user.tag} Welcome to Panda Planet, Please check out the ${rules_channel} <:slight_smile:935888459564986408>`
  );
  addEmbed.setFooter({ text: "Made by Daisy FoxPanda" });
  channel.send({ embeds: [addEmbed] });
});

// When a person leaves the discord
client.on("guildMemberRemove", (member) => {
  const channel = client.channels.cache.get(FrontDoor);
  const removeEmbed = new MessageEmbed();
  removeEmbed.setColor("#8000FF");
  removeEmbed.setTitle(`${member.user.tag} Left`);
  removeEmbed.setAuthor({
    name: member.user.tag,
    iconURL: member.user.avatarURL(),
  });
  removeEmbed.setDescription(
    `${member.user.tag} I hope you enjoyed your stay <:frowning2:936002078017454090>`
  );
  removeEmbed.setFooter({ text: "Made by Daisy FoxPanda" });
  channel.send({ embeds: [removeEmbed] });
});

// Normal Commands
client.on("messageCreate", (message) => {
  if (
    message.author.bot ||
    !message.content.startsWith(prefix) ||
    message.channel.type === "DM"
  )
    return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "ping") client.commands.get("ping").execute(message, args);
  if (command === "say") client.commands.get("say").execute(message, args);
  if (command === "kick") client.commands.get("kick").execute(message, args);
  if (command === "ban") client.commands.get("ban").execute(message, args);
});

// Ticket System
client.on("messageCreate", async (message) => {
  if (message.author.bot || message.content.startsWith(prefix)) return;
  const channel = client.channels.cache.get(SupportID);

  // This deals with the user messaging the bot and sends messages to the support channel
  if (message.channel.type === "DM") {
    const ticketEmbed = new MessageEmbed();
    if (message.type === "DEFAULT") {
      ticketEmbed.setColor("#8000FF");
      ticketEmbed.setTitle("Support Ticket " + GetDateStamp());
      ticketEmbed.setAuthor({
        name: message.author.tag,
        iconURL: message.author.avatarURL(),
      });
      ticketEmbed.setDescription(message.content);
      ticketEmbed.setFooter({ text: "Made by Daisy FoxPanda" });
      channel.send({ embeds: [ticketEmbed] });
      message.channel.send({ embeds: [ticketEmbed] });
    }
    if (message.type === "REPLY") {
      messageID = message.reference.messageId;
      message_fetch = await message.channel.messages.fetch(messageID);
      for (embed of message_fetch.embeds) {
        if (embed.fields.length < 1) {
          ticketEmbed.setColor("#8000FF");
          ticketEmbed.setTitle("Replying To Support Ticket " + GetDateStamp());
          ticketEmbed.setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          });
          ticketEmbed.setDescription(embed.description);
          ticketEmbed.addField("Reply: ", message.content, true);
          ticketEmbed.setFooter({ text: "Made by Daisy FoxPanda" });
        } else {
          const value = embed.fields.map(({ value }) => value);
          ticketEmbed.setColor("#8000FF");
          ticketEmbed.setTitle("Replying To Support Ticket " + GetDateStamp());
          ticketEmbed.setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          });
          ticketEmbed.setDescription(value[0]);
          ticketEmbed.addField("Reply: ", message.content, true);
          ticketEmbed.setFooter({ text: "Made by Daisy FoxPanda" });
        }
        channel.send({ embeds: [ticketEmbed] });
        message.channel.send({ embeds: [ticketEmbed] });
      }
    }
  }

  // This deals with people replying from the support channel and messages the user
  if (message.type == "REPLY" && message.channelId == SupportID) {
    if (message.reference != null) {
      messageID = message.reference.messageId;
      message_fetch = await message.channel.messages.fetch(messageID);
      for (embed of message_fetch.embeds) {
        const ticketEmbed = new MessageEmbed();
        if (embed.fields.length < 1) {
          ticketEmbed.setColor("#8000FF");
          ticketEmbed.setTitle("Replying To Ticket " + GetDateStamp());
          ticketEmbed.setAuthor({
            name: client.user.username,
            iconURL: client.user.avatarURL(),
          });
          ticketEmbed.setDescription(embed.description);
          ticketEmbed.addField("Reply: ", message.content, true);
          ticketEmbed.setFooter({ text: "Made by Daisy FoxPanda" });
        } else {
          const value = embed.fields.map(({ value }) => value);
          ticketEmbed.setColor("#8000FF");
          ticketEmbed.setTitle("Replying To Ticket " + GetDateStamp());
          ticketEmbed.setAuthor({
            name: client.user.username,
            iconURL: client.user.avatarURL(),
          });
          ticketEmbed.setDescription(value[0]);
          ticketEmbed.addField("Reply: ", message.content, true);
          ticketEmbed.setFooter({ text: "Made by Daisy FoxPanda" });
        }
        channel.send({ embeds: [ticketEmbed] });
        const user_id = client.users.cache.find(
          (u) => u.tag === embed.author.name
        ).id;
        const user = client.users.cache.get(user_id);
        user.send({ embeds: [ticketEmbed] });
      }
    }
  }
});

client.login("OTMzNzIxNTUzNDg3NjgzNjU0.Yelp9g.9ZywIVOCK8W1SDptmfodTNYPXK0");
