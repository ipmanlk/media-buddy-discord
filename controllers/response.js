const TinyURL = require("tinyurl");
const Config = require("../config/config.json");

const numberFormats = {
    "audio only (DASH audio)": "1",
    "256x144 (144p)": "2",
    "426x240 (240p)": "3",
    "640x360 (360p)": "4",
    "854x480 (480p)": "5",
    "1280x720 (720p)": "6",
    "1920x1080 (1080p)": "7",
    "2560x1440 (1440p)": "8",
    "3840x2160 (2160p)": "9"
};

const sendFormats = (msg, formats) => {
    const embed = {
        color: 0xff3333,
        title: "MediaBuddy : Video Formats",
        url: 'https://discord.gg/2PeSHh4',
        description: `Please reply with the **${Config.BOT_PREFIX}Format Number** you want,`,
        thumbnail: {
            url: "https://tinyurl.com/y4eooy42",
        },
        fields: [],
        footer: {
            text: "Developed By ipmanlk@LKDevelopers🇱🇰",
            icon_url: "https://i.imgur.com/eZmV5bx.png",
        }
    };

    // append formats to embed
    formats.forEach(format => {
        embed.fields.push({
            name: `Format No: ${numberFormats[format]}`,
            value: `${format}`,
            inline: true
        });
    });

    // send embed to channel
    msg.channel.send({ embed });
};

const sendDownLink = (msg, downLink) => {
    TinyURL.shorten(downLink).then(function (shortUrl) {
        const embed = {
            color: 0xff3333,
            title: "MediaBuddy : Download",
            url: 'https://discord.gg/2PeSHh4',
            description: "Here is your download link",
            fields: [{
                name: `Link`,
                value: `${shortUrl}`,
            }],
            footer: {
                text: "Developed By ipmanlk@LKDevelopers🇱🇰",
                icon_url: "https://i.imgur.com/eZmV5bx.png",
            }
        };

        // send embed to channel
        msg.channel.send({ embed });

    }, function (err) {
        console.log(err);
        // when url shortner fail
        msg.reply(msg, `**Unable to shorten the url!. Please report this error to the developer.**\n\nHere is your download link : ${downLink}`);
    });
};

const sendHelp = (msg) => {
    msg.reply(`Just enter **${Config.BOT_PREFIX}[Video Link]**.`);
};

module.exports = {
    sendFormats,
    sendDownLink,
    sendHelp
};