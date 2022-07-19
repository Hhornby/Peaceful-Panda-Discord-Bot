const Discord = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a user",
  execute(message, args) {
    const banUser = message.mentions.users.first();

    if (!message.member.permissions.has("BAN_MEMBERS")) {
      let enbed = new Discord.MessageEnbed()
        .setTitle(`${message.author.username}`)
        .setDescription(
          "Sorry but you dont have the correct permission to use this command"
        )
        .setTimestamp()
        .setColor("#a60707");
      return message.channel.send({ enbeds: [enbed] });
    }

    if (banUser) {
      var member = message.guild.members.cache.get(banUser.id);

      if (member) {
        member.ban().then(() => {
          let enbed = new Discord.MessageEnbed()
            .setTitle("You banned a user")
            .setDescription(` :white_check_mark: You banned <@${banUser.id}>`)
            .addField("moderator", message.author.username)
            .setTimestamp()
            .setColor("#800080");
          message.channel.send({ enbeds: [enbed] });
        });
      }
    }
  },
};
