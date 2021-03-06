const { Client, MessageEmbed } = require('discord.js');
const Sequelize = require('sequelize');
const fs = require("fs");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });
const config = require("./config.json");
const Discord = require("discord.js");
const { emitKeypressEvents } = require('readline');
const commands = new Discord.Collection();
const channels = [];
var guild;

console.log("[ABOUT] ArchiveBot by TheAirBlow");
console.log("[ABOUT] https://github.com/theairblow/archivebot");

const sequelize = new Sequelize('database', 'admin', 'admin', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = sequelize.define('message', {
    messageId: {
        type: Sequelize.BIGINT,
        unique: true,
    },
	channel: Sequelize.BIGINT,
	message: Sequelize.TEXT,
    oldMessage: Sequelize.TEXT,
    edited: Sequelize.BOOLEAN,
    deleted: Sequelize.BOOLEAN, 
	username: Sequelize.STRING,
});

const Tags2 = sequelize.define('channel', {
	channel: {
        type: Sequelize.BIGINT,
        unique: true,
    },
	enabled: Sequelize.BOOLEAN,
});

async function checkMax() {
    if (config.audit.maxMessages < 0) return;
    await Tags2.findAll().then(async result => {
        for await (const obj of result) {
            const channel = obj.get('channel');
            if (obj.get('enabled')) {
                const count = Tags.count({ where: { channel: channel } });
                if (count > config.audit.maxMessages) {
                    Tags2.delete({ where: { channel: channel } });
                }
            }
        }
    });
}

function presence() {
    fs.writeFile('./config.json', JSON.stringify(config, null, 2), function(){});
    client.user.setActivity(`${config.prefix}help | TheAirBlow`);
}

client.on("guildCreate", guild => {
    if (guild.id !== config.guild) {
        console.log(`[WARN] Guild "${guild.name}" tried to add the bot (${guild.id})`);
        guild.leave();
    }
});

client.on('ready', () => {
    console.log(`[INFO] Logged in as ${client.user.tag}!`);
    Tags.sync(); Tags2.sync();
    console.log(`[INFO] SQLite loaded!`);
    presence();
    setInterval(presence, 10000);
});

fs.readdir("./commands/", async (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`[INFO] Loading command ${commandName}`);
        commands.set(commandName, props);
    });
});

client.on('messageCreate', async (message) => {
    guild = message.guild;
    if (!channels.includes(message.channel)) channels.push(message.channel);
    const tag = await Tags2.findOne({ where: { channel: message.channelId } });
    if (tag && tag.get('enabled') == true) {
        if ((config.audit.auditBotMessages && message.author.bot) || !message.author.bot) {
            await Tags.create({
                messageId: message.id,
                channel: message.channelId,
                message: message.content,
                edited: false,
                deleted: false,
                username: message.member.user.tag,
            });
            await checkMax();
        }
    }
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args, command, Tags, Tags2);
});

client.on('messageDelete', async (message) => {
    guild = message.guild;
    if (!channels.includes(message.channel)) channels.push(message.channel);
    const tag = await Tags2.findOne({ where: { channel: message.channelId } });
    try {
        if (tag && tag.get('enabled') == true) {
            if ((config.audit.auditBotMessages && message.author.bot) || !message.author.bot) {
                await Tags.update({ deleted: true }, { where: { messageId: message.id } });
                await checkMax();
            }
        }
    } catch { }
    if ((message.author.bot && !config.audit.auditBotMessage) || message.member.id === client.user.id) return;
    if (!config.report.delete) return;
    const exampleEmbed = new MessageEmbed().setTitle(`Deleting | ${message.member.user.tag}`)
    .setDescription(message.content).setColor(0x0000FF);
    message.channel.send({ embeds: [exampleEmbed] });
});

client.on('messageUpdate', async (oldMessage, message) => {
    guild = message.guild;
    if (!channels.includes(message.channel)) channels.push(message.channel);
    const tag = await Tags2.findOne({ where: { channel: message.channelId } });
    try {
        if (tag && tag.get('enabled') == true) {
            if ((config.audit.auditBotMessages && message.author.bot) || !message.author.bot) {
                await Tags.update({ edited: true, oldMessage: oldMessage.content, message: message.content }, 
                    { where: { messageId: message.id } });
                await checkMax();
            }
        }
    } catch { }
    if (message.author.bot && !config.audit.auditBotMessage && message.member.id === client.user.id) return;
    if (!config.report.edit) return;
    const exampleEmbed = new MessageEmbed().setTitle(`Edit | ${message.member.user.tag}`)
    .setDescription(`${oldMessage.content} to ${message.content}`).setColor(0x0000FF);
    message.channel.send({ embeds: [exampleEmbed] });
});

client.on("channelDelete", async function(oldChannel) {
    await require('./commands/archive').archive(client, oldChannel.id, Tags, Tags2);
});

client.login(config.token);