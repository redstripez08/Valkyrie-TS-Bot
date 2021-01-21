"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("./utils");
const luxon_1 = require("luxon");
const { version } = require("../package.json");
console.log(`Environment: ${utils_1.checkNodeEnv("dev") ? "Development" : "Production"}`);
console.log("Initializing Client...");
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const { PREFIX = "v!", TOKEN } = process.env;
if (!TOKEN)
    throw new Error("Token Not Found!");
const commands = client.commands = new Discord.Collection();
(async () => {
    const commandFiles = {
        base: (await fs.promises.readdir(path.resolve(__dirname, "./commands/base/"))).filter(file => /.js$|.ts$/.test(file)),
        ready: (await fs.promises.readdir(path.resolve(__dirname, "./commands/ready/"))).filter(file => /.js$|.ts$/.test(file)),
    };
    for (const commandFile of commandFiles.base) {
        try {
            const command = require(path.resolve(__dirname, `./commands/base/${commandFile}`)).default;
            commands.set(command.name, command);
        }
        catch (err) {
            throw new Error("FileHandlerError: " + err);
        }
    }
    client.on("ready", () => {
        for (const commandFile of commandFiles.ready) {
            try {
                require(path.resolve(__dirname, `./commands/ready/${commandFile}`)).default(client);
            }
            catch (err) {
                throw new Error("ReadyCommandExecutorError: " + err);
            }
        }
        client.user?.setActivity(`${PREFIX}help`, { type: "LISTENING" });
        console.log(`${client.user?.username} v${version} Ready\n`);
    });
    client.on("message", message => {
        if (!message.content.toLowerCase().startsWith(PREFIX) || message.author.bot)
            return;
        const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));
        if (!command)
            return;
        if (command.argsRequired && !args.length) {
            return message.channel.send("Args Required!");
        }
        if (command.guildOnly && message.channel.type !== "text") {
            return message.channel.send(`\`${command.name}\` can only be executed in servers!`);
        }
        try {
            command.execute(message, args);
        }
        catch (err) {
            const errMsg = `[${luxon_1.DateTime.fromJSDate(new Date()).toUTC()}] IndexError:\t${err}`;
            console.error(errMsg);
            message.channel.send(`**There was an error!**\n\`${err}\``);
        }
    });
    client.login(TOKEN).catch(err => { throw new Error("LoginError: " + err); });
})();
