import * as Discord from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { checkNodeEnv } from "./utils";
import { Command, Client } from "./typings/types";
import { DateTime } from "luxon";
const { version } = require("../package.json");

console.log(`Environment: ${checkNodeEnv("dev") ? "Development" : "Production"}`);
console.log("Initializing Client...");
const client: Client = new Discord.Client({ws:{intents: Discord.Intents.ALL}});

// Tokens are essential to run and authorize Discord bots. If none found, it throws an Error.
const { PREFIX = "v!", TOKEN } = process.env;
if (!TOKEN) throw new Error("Token Not Found!");

// Initializes a Collection class (Discord.Collection is a Map utility with a lot more mehtods) to store commands.
const commands = client.commands = new Discord.Collection<string, Command>();

(async() => {
    // Read file names in command subdirectories and filters for .js or .ts files.
    const commandFiles = {
        base: (await fs.promises.readdir(path.resolve(__dirname, "./commands/base/"))).filter(file => /.js$|.ts$/.test(file)),
        ready: (await fs.promises.readdir(path.resolve(__dirname, "./commands/ready/"))).filter(file => /.js$|.ts$/.test(file)),
    };

    // Cache base commands (commands executed by prefixed message) in Collection (Map Utility)
    for (const commandFile of commandFiles.base) {
        try {
            // Commands export using ES6 `export default` syntax. You can only loop over imports
            // using commonjs `require` syntax, so we have to add `.default` to get the actual command.
            const command: Command = require(path.resolve(__dirname, `./commands/base/${commandFile}`)).default;

            // Sets command name as key, and full command object as value.
            commands.set(command.name, command);
        } catch (err) {
            throw new Error("FileHandlerError: " + err);
        }
    }

    client.on("ready", () => {
        for (const commandFile of commandFiles.ready) {
            try {
                require(path.resolve(__dirname, `./commands/ready/${commandFile}`)).default(client);
            } catch (err) {
                throw new Error("ReadyCommandExecutorError: " + err);
            }
        }

        client.user?.setActivity(`${PREFIX}help`, {type: "LISTENING"});
        console.log(`${client.user?.username} v${version} Ready\n`);
    });

    client.on("message", message => {
        // If message does not start with prefix or is a bot, it ends.
        if (!message.content.toLowerCase().startsWith(PREFIX) || message.author.bot) return;

        // Slices off prefix and splits message content by space into an array.
        const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        // Tries to find a command that matches `commandName`. Returns undefined if none found.
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));

        // If no command can be found, it returns void.
        if (!command) return;

        if (command.argsRequired && !args.length) {
            return message.channel.send("Args Required!");
        }

        if (command.guildOnly && message.channel.type !== "text") {
            return message.channel.send(`\`${command.name}\` can only be executed in servers!`);
        }

        try {
            // Executes the command
            command.execute(message, args);
        } catch (err) {
            const errMsg = `[${DateTime.fromJSDate(new Date()).toUTC()}] IndexError:\t${err}`;
            console.error(errMsg);
            message.channel.send(`**There was an error!**\n\`${err}\``);
        }
    });

    client.login(TOKEN).catch(err => {throw new Error("LoginError: " + err)});
})();