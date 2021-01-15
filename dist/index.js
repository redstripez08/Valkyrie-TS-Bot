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
const checkNodeEnv_1 = require("./utils/checkNodeEnv");
const { version } = require("../package.json");
console.log(`${checkNodeEnv_1.EnvChecker("dev") ? "Development" : "Production"} Environment`);
console.log("Initializing Client...");
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const { PREFIX = "cn!", TOKEN } = process.env;
if (!TOKEN)
    throw new Error("Token Not Found!");
const commands = client.commands = new Discord.Collection();
(async () => {
    const commandFiles = {
        base: (await fs.promises.readdir(path.resolve(__dirname, "./commands/base/"))).filter(file => /.js$|.ts$/.test(file)),
        ready: (await fs.promises.readdir(path.resolve(__dirname, "./commands/ready/"))).filter(file => /.js$|.ts$/.test(file)),
    };
    for (const commandFile of commandFiles.base) {
        const command = require(path.resolve(__dirname, `./commands/base/${commandFile}`));
        commands.set(command.name, command);
    }
    client.on("ready", () => {
        client.user?.setActivity(`${PREFIX}help`, { type: "LISTENING" });
        console.log(`${client.user?.username} v${version} ready`);
    });
    client.on("message", message => {
        if (!message.content.toLowerCase().startsWith(PREFIX) || message.author.bot)
            return;
        const args = message.content.slice(PREFIX.length).split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));
        if (!command)
            return;
        try {
            command.execute(message, args);
        }
        catch (err) {
            console.error(err);
            message.channel.send(`There was an error!:\n\`${err}\``);
        }
    });
    client.login(TOKEN);
})();