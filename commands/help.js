const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, commands) => {
    const exampleEmbed = new MessageEmbed().setTitle("Commands").setColor(0x00FF00)
    .setDescription("Here is the list of commands")
    .addField('\u200B', '**Admin and Info**')
    .addField('help', 'Shows this message', true)
    .addField('reload', 'Reloads all commands', true)
    .addField('ping', "Bot's latency", true)
    .addField('prefix', "Set bot's prefix", true)
    .addField('purge <count>', "Purge messages", true)
    .addField('\u200B', '**Audit**')
    .addField('audit add', 'Adds this channel to audit', true)
    .addField('audit remove', 'Remove this channel from audit', true)
    .addField('audit max <number>', "Set max audit entries", true)
    .addField('audit deleted', "Audit deleted messages", true)
    .addField('audit edits', 'Audit edits', true)
    .addField('audit clear', 'Clears audit', true)
    .addField('audit list', "List of audit IDs", true)
    .addField('audit data <id>', "Get audit info of message", true)
    .addField('\u200B', '**Archive**')
    .addField('archive auto', 'Auto-archive deleted channel', true)
    .addField('archive archive', 'Archive this channel', true)
    .addField('archive data <id>', 'Get channel archive', true);
    message.channel.send({ embeds: [exampleEmbed] });
}