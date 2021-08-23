const { MessageEmbed, Permissions } = require('discord.js');
const Discord = require("discord.js");
const config = require('../config.json');
const archive = require('./archive');

var code = "";

exports.run = async (client, message, args, commands, Tags, Tags2) => {
    const channel = message.channel;
    if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        const exampleEmbed1 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Fuck you!").setColor(0xFF0000);
        channel.send({ embeds: [exampleEmbed1] });
        return;
    }
    if (args.length == 0) {
        const exampleEmbed11 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Specify a command!").setColor(0x000000);
        channel.send({ embeds: [exampleEmbed11] });
        return;
    }
    switch(args[0]) {
        case "last":
            try { 
                const tags = await Tags.findAll({ where: { channel: message.channelId }, order: [ [ 'createdAt', 'DESC' ]] });
                const tag = tags[1];
                const exampleEmbed7 = new MessageEmbed().setTitle(tag.username).setDescription(tag.message).setColor(0x00FF00)
                .addField("Edited", tag.edited ? "Yes" : "No", true).addField("Deleted", tag.deleted ? "Yes" : "No", true)
                .addField("Channel ID", tag.channel.toString(), true);
                if (tag.edited) exampleEmbed7.addField("Old Message", tag.oldMessage);
                channel.send({ embeds: [exampleEmbed7] });
            } catch (e) {
                const exampleEmbed5 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Audit is empty!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbed5] });
                console.log(e);
            }
            break;
        case "list":
            const tagList = await Tags.findAll({ where: { channel: message.channelId } });
            const tagString = tagList.map(t => t.messageId).slice(0, tagList.length <= 15 ? tagList.length : 15).join(', ') || 'Audit is empty!';
            const exampleEmbed22 = new MessageEmbed().setTitle("ArchiveBot").setDescription(tagString).setColor(0x00FF00);
            channel.send({ embeds: [exampleEmbed22] });
            break;
        case "data":
            if (args.length < 2) {
                const exampleEmbed2 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Specify message ID!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbed2] });
            }
            try { 
                const msg = BigInt(args[1]);
                const tag = await Tags.findOne({ where: { messageId: msg } });
                if (tag) {
                    const exampleEmbed7 = new MessageEmbed().setTitle(tag.username).setDescription(tag.message).setColor(0x00FF00)
                    .addField("Edited", tag.edited ? "Yes" : "No", true).addField("Deleted", tag.deleted ? "Yes" : "No", true)
                    .addField("Channel ID", tag.channel.toString(), true);
                    if (tag.edited) exampleEmbed7.addField("Old Message", tag.oldMessage);
                    channel.send({ embeds: [exampleEmbed7] });
                } else {
                    const exampleEmbed9 = new MessageEmbed().setTitle("ArchiveBot").setDescription("This message is not it audit!").setColor(0xFF0000);
                    channel.send({ embeds: [exampleEmbed9] });
                }
            } catch (e) {
                const exampleEmbed5 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Specify a valid number!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbed5] });
            }
            break;
        case "clear":
            if (args.length < 2) {
                code = archive.makeid(5);
                const exampleEmbedtr = new MessageEmbed().setTitle("ArchiveBot").setDescription("Use this code as an argument to continue: " + code)
                .setColor(0xFFFF00);
                channel.send({ embeds: [exampleEmbedtr] });
                return;
            }

            if (args[1] !== code) {
                const exampleEmbedty = new MessageEmbed().setTitle("ArchiveBot").setDescription("Wrong code!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbedty] });
                code = "";
                return;
            }

            await Tags.destroy({ where: { channel: message.channelId } });
            const exampleEmbedqq = new MessageEmbed().setTitle("ArchiveBot").setDescription("Audit was cleared!").setColor(0x00FF00);
            channel.send({ embeds: [exampleEmbedqq] });
            code = "";
            break;
        case "add":
            try {
                await Tags2.create({
                    channel: message.channelId,
                    enabled: true,
                });
            } catch {
                const exampleEmbed88 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Channel is already added!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbed88] });
                break;
            }
            const exampleEmbed8 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Current channel was added for audit!").setColor(0x00FF00);
            channel.send({ embeds: [exampleEmbed8] });
            break;
        case "remove":
            try { await Tags2.update({ enabled: false }, { where: { channel: message.channelId } }); }
            catch {
                const exampleEmbed0 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Channel is not added!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbed0] });
                break;
            }
            const exampleEmbed00 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Current channel was removed from audit!").setColor(0x00FF00);
            channel.send({ embeds: [exampleEmbed00] });
            break;
        case "max":
            if (args.length < 2) {
                const exampleEmbed44 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Specify max value!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbed44] });
            }
            try { 
                const max = Number(args[1]);
                config.audit.maxMessages = max;
                const exampleEmbedp = new MessageEmbed().setTitle("ArchiveBot").setDescription("New value: " + max)
                .setColor(0x00FF00);
                message.channel.send({ embeds: [exampleEmbedp] });
            } catch {
                const exampleEmbedo = new MessageEmbed().setTitle("ArchiveBot").setDescription("Specify a valid number!").setColor(0xFF0000);
                channel.send({ embeds: [exampleEmbedo] });
            }
            break;
        case "deleted":
            config.audit.auditDeletedMessages = !config.audit.auditDeletedMessages;
            const exampleEmbedy = new MessageEmbed().setTitle("ArchiveBot").setDescription("New value: " + config.audit.auditDeletedMessages)
            .setColor(0x00FF00);
            message.channel.send({ embeds: [exampleEmbedy] });
            break;
        case "edits":
            config.audit.auditEdits = !config.audit.auditEdits;
            const exampleEmbedyy = new MessageEmbed().setTitle("ArchiveBot").setDescription("New value: " + config.audit.auditEdits)
            .setColor(0x00FF00);
            message.channel.send({ embeds: [exampleEmbedyy] });
            break;
        case "bots":
            config.audit.auditBotMessages = !config.audit.auditBotMessages;
            const exampleEmbedt = new MessageEmbed().setTitle("ArchiveBot").setDescription("New value: " + config.audit.auditBotMessages)
            .setColor(0x00FF00);
            message.channel.send({ embeds: [exampleEmbedt] });
            break;
        default:
            const exampleEmbedot = new MessageEmbed().setTitle("ArchiveBot").setDescription("Unknown sub-command!").setColor(0xFF0000);
            channel.send({ embeds: [exampleEmbedot] });
            break;
    }
}