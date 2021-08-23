const { MessageEmbed, Permissions } = require('discord.js');
const config = require('../config.json');

exports.run = (client, message, args, commands) => {
    if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        const exampleEmbed = new MessageEmbed().setTitle("ArchiveBot").setDescription("Fuck you!").setColor(0xFF0000);
        channel.send({ embeds: [exampleEmbed] });
        return;
    }
    if (args.length == 0) {
        const exampleEmbed = new MessageEmbed().setTitle("ArchiveBot").setDescription("No prefix specified!").setColor(0xFF0000);
        channel.send({ embeds: [exampleEmbed] });
        return;
    }
    config.prefix = args[0];
    const exampleEmbed = new MessageEmbed().setTitle("ArchiveBot").setDescription("Prefix changed to " + args[0]).setColor(0x00FF00);
    message.channel.send({ embeds: [exampleEmbed] });
}