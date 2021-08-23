const { MessageEmbed, Permissions } = require('discord.js');
const Discord = require("discord.js");
const config = require('../config.json');
const fs = require('fs');
const { exception } = require('console');
const StringBuilder = require("string-builder");

exports.makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

exports.archive = async (client, id, Tags) => {
    var data = "ArchiveBot | Channel " + id + "\n";
    await Tags.findAll({ where: { channel: id } }).then(async result => {
        for await (const obj of result) {
            if (obj.edited) data += `${obj.username}: ${obj.message} (Old: ${obj.oldMessage}) `;
            else data += `${obj.username}: ${obj.message} `;
            if (obj.deleted) data += "(Deleted)\n"
            else data += "\n";
        }
    });

    const fileName = `${id}.txt`;
    try { await fs.mkdirSync('./archive/'); } catch { }
    await fs.writeFileSync(`./archive/${fileName}`, data);
    return fileName;
};

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
        case "data":
            if (args.length < 2) {
                const exampleEmbed11 = new MessageEmbed().setTitle("ArchiveBot").setDescription("Specify channel!").setColor(0x000000);
                channel.send({ embeds: [exampleEmbed11] });
            }
            try {
                if (!await fs.existsSync(`./archive/${args[1]}.txt`)) throw new exception();
                const exampleEmbedq = new MessageEmbed().setTitle("ArchiveBot").setDescription(`Archive was found!`).setColor(0x00FF00);
                message.channel.send({ embeds: [exampleEmbedq], files: [ `./archive/${args[1]}.txt` ] });
            } catch {
                const exampleEmbedrr = new MessageEmbed().setTitle("ArchiveBot").setDescription("No archive found!").setColor(0xFF0000);
                message.channel.send({ embeds: [exampleEmbedrr] });
            }
            break;
        case "channel":
            const fileName = await this.archive(client, message.channelId, Tags);
            const exampleEmbedq = new MessageEmbed().setTitle("ArchiveBot").setDescription(`Archive created successfully!`)
            .setColor(0x00FF00);
            message.channel.send({ embeds: [exampleEmbedq], files: [ `./archive/${fileName}` ] });
            break;
        case "auto":
            config.archive.autoArchiveOnDelete = !config.archive.autoArchiveOnDelete;
            const exampleEmbedy = new MessageEmbed().setTitle("ArchiveBot").setDescription("New value: " + config.archive.autoArchiveOnDelete)
            .setColor(0x00FF00);
            message.channel.send({ embeds: [exampleEmbedy] });
            break;
        default:
            const exampleEmbedot = new MessageEmbed().setTitle("ArchiveBot").setDescription("Unknown sub-command!").setColor(0xFF0000);
            channel.send({ embeds: [exampleEmbedot] });
            break;
    }
}