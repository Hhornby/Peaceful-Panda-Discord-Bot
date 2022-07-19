const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Returns pong",
  execute(message, args) {
    message.channel.send("pong!");
  },
};
