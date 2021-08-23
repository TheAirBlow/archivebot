const { MessageEmbed, Permissions } = require('discord.js');

exports.run = (client, message, args, commands) => {
    if (args.length == 0) {
        const exampleEmbed11 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Specify a command!").setColor(0x000000);
        channel.send({ embeds: [exampleEmbed11] });
        return;
    }
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        const exampleEmbed1 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Fuck you!").setColor(0xFF0000);
        channel.send({ embeds: [exampleEmbed1] });
        return;
    }
    message.channel.bulkDelete(Number.parseInt(args[0]), true);
}