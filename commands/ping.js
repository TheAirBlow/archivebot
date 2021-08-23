const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, commands) => {
    const exampleEmbed = new MessageEmbed().setTitle("ArchiveBot").setDescription("Ping pong motherfucker!")
    .addField("Latency", (Date.now() - message.createdTimestamp).toString(), true).addField("API", Math.round(client.ws.ping).toString(), true)
    .setColor(0x00FF00);
    message.channel.send({ embeds: [exampleEmbed] });
}