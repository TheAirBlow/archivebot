const { Permissions, MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, commands) => {
  if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    const exampleEmbed = new MessageEmbed().setTitle("ArchiveBot").setDescription("Fuck you!").setColor(0xFF0000);
    channel.send({ embeds: [exampleEmbed] });
    return;
  }
  console.log(`[WARN] Reloading all commands...`);
  commands = new Discord.Collection();
  fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      delete require.cache[require.resolve(`./${file}`)];
      let props = require(`./${file}`);
      let commandName = file.split(".")[0];
      console.log(`[INFO] Loading command ${commandName}`);
      commands.set(commandName, props);
      });
  });
  console.log(`[INFO] Done reloading!`);
  const exampleEmbed = new MessageEmbed().setTitle("ArchiveBot").setDescription("Comands were reloaded!").setColor(0x00FF00);
  message.channel.send({ embeds: [exampleEmbed] });
};