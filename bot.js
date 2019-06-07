const DiscordJs = require("discord.js");
const Config = require("./config/config.json");
const Ytdl = require("./libs/ytdl");
const Response = require("./controllers/response");

// new discord client
const client = new DiscordJs.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    updateActivity();
});

client.on("message", msg => {
    // ignore bot msgs 
    if (msg.author.bot) { return; }
    //check msgs not start with trigger
    if (!(msg.content).startsWith(Config.BOT_PREFIX)) { return; }

    if ((msg.content).split(Config.BOT_PREFIX)[1]) {
        msgHandler(msg);
    }

    // delete command
    msg.delete(1000);
});

const updateActivity = () => {
    client.user.setActivity(`Serving ${client.guilds.size} servers | By ipmanlk@LKDevelopers🇱🇰`);
};

// login to client
client.login(Config.BOT_TOKEN);

// formats with response numbers
const formatNumbers = {
    "1": "audio only (DASH audio)",
    "2": "256x144 (144p)",
    "3": "426x240 (240p)",
    "4": "640x360 (360p)",
    "5": "854x480 (480p)",
    "6": "1280x720 (720p)",
    "7": "1920x1080 (1080p)",
    "8": "2560x1440 (1440p)",
    "9": "3840x2160 (2160p)"
};

// store user requested videos
const userVideo = {};

const msgHandler = (msg) => {
    // get user entered value
    let input = (msg.content).split(Config.BOT_PREFIX)[1].trim();

    // check for help command
    if (input === "help") {
        Response.sendHelp(msg);
        return;
    }

    // regex for youtube urls
    const ytRegEx = new RegExp("^(http(s)?:\/\/)?((w){3}.)?(m.)?youtu(be|.be)?(\.com)?\/.+");

    // invalid input
    if (!ytRegEx.test(input) && isNaN(input)) {
        msg.reply("Invalid input boi!");
        return;
    }

    // if it's a yt link send formats
    if (ytRegEx.test(input)) {
        msg.reply("Wait until I fetch formats for ya!.");
        Ytdl.getVidInfo(input).then(formats => {
            userVideo[msg.author.id] = input;
            Response.sendFormats(msg, formats);
        }).catch(err => {
            console.log(err);
        });
    }

    // else send download link
    if (!isNaN(input)) {
        let format = formatNumbers[input];
        // check if a video was requested by that user before
        if (!userVideo[msg.author.id]) {
            msg.reply("Please send a video link first!.");
            return;
        }
        // send wait msg
        msg.reply("I'm generating your download link. Please be patient.");

        // video link
        let link = userVideo[msg.author.id];
        // remove from memory
        delete userVideo[msg.author.id];

        // get download link
        Ytdl.getVidDownLink(link, format).then(downLink => {
            Response.sendDownLink(msg, downLink);
        }).catch(err => {
            console.log(err);
        });
    }
};