import * as Discord from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { EnvChecker } from "./utils/checkNodeEnv";
import { Command } from "./typings/types";
const { version } = require("../package.json");

console.log(`${EnvChecker("dev") ? "Development" : "Production"} Environment`);
console.log("Initializing Client...");
const client = new Discord.Client({ws:{intents: Discord.Intents.ALL}});

const { PREFIX = "cn!", TOKEN } = process.env;
if (!TOKEN) throw new Error("Token Not Found!");

const commands = client.commands = new Discord.Collection<string, Command>();

(async() => {
    // Read file names in command subdirectories and filters for .js or .ts files.
    const commandFiles = {
        base: (await fs.promises.readdir(path.resolve(__dirname, "./commands/base/"))).filter(file => /.js$|.ts$/.test(file)),
        ready: (await fs.promises.readdir(path.resolve(__dirname, "./commands/ready/"))).filter(file => /.js$|.ts$/.test(file)),
    };
    
    // Cache base commands (commands executed by prefixed message) in Collection (Map Utility)
    for (const commandFile of commandFiles.base) {
        const command: Command = require(path.resolve(__dirname, `./commands/base/${commandFile}`));
        commands.set(command.name, command);
    }
    
    client.on("ready", () => {
        client.user?.setActivity(`${PREFIX}help`, {type: "LISTENING"});
        console.log(`${client.user?.username} v${version} ready`);
    });

    client.on("message", message => {
        // If message does not start with prefix or is a bot, it ends.
        if (!message.content.toLowerCase().startsWith(PREFIX) || message.author.bot) return;

        // Slices off prefix and splits message content by space into an array.
        const args = message.content.slice(PREFIX.length).split(/ +/g);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        // Tries to find a command that matches `commandName`. Returns undefined if none found.
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));

        // If no command can be found, it returns void.
        if (!command) return;

        // Executes the command
        try {
            command.execute(message, args);
        } catch (err) {
            console.error(err);
            message.channel.send(`There was an error!:\n\`${err}\``);
        }
    });

    client.login(TOKEN);
})();

