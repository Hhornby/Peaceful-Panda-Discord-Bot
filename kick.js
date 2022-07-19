const Discord = require("discord.js");

module.exports = {
  name: "kick",
  description: "kicks a user",
  execute(message, args) {
    const kickUser = message.mentions.users.first();

    if (!message.member.permissions.has("KICK_MEMBERS")) {
      let enbed = new Discord.MessageEmbed()
        .setTitle(`${message.author.username}`)
        .setDescription(
          "Sorry but you dont have the correct permission to use this command"
        )
        .setTimestamp()
        .setColor("#a60707");
      return message.channel.send({ enbeds: [enbed] });
    }

    if (kickUser) {
      var member = message.guild.members.cache.get(kickUser.id);

      if (member) {
        member.kick("You have been bad").then(() => {
          let enbed = new Discord.MessageEmbed()
            .setTitle("You kicked a user")
            .setDescription(` :white_check_mark: You kicked <@${kickUser.id}>`)
            .addField("moderator", message.author.username)
            .setColor("#800080");
          message.channel.send({ enbeds: [enbed] });
        });
      }
    }
  },
};
