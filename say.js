const Discord = require("discord.js");

module.exports = {
  name: "say",
  description: "Returns a message given by a user",
  execute(message, args) {
    const msg = args.join(" ");
    if (!msg)
      return message.channel.send(
        "you need to specify a message you want me to say"
      );

    message.delete();
    message.channel.send(msg);
  },
};
