import * as Discord from "discord.js";
import * as querystring from "querystring";
import  axios, { AxiosResponse } from "axios";
import { Command } from "../../typings/types";

/** Response of The Facts API */
interface Response extends AxiosResponse {
    data: {
        id: string;
        text: string;
        source: string;
        source_url: string;
        language: "en" | "de";
        permalink: string;
    }
};

const command: Command = {
    name: "fact",
    aliases: ["facts"],
    description: "Gets a random fact using [https://uselessfacts.jsph.pl/](https://uselessfacts.jsph.pl/random.html?language=en) API.",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new URL("/random.json", "https://uselessfacts.jsph.pl/");
            link.search = querystring.stringify({language: "en"});
            
            const res: Response = await axios.get(link.href);
            const embed = new Discord.MessageEmbed()
                .setColor("#fff")
                .setDescription(res.data.text)
                .setURL(res.data.source_url);

            message.channel.send(embed);
        } catch (error: any) {
            if (error.response) {
                console.error(error);
                console.error(error.response);
                message.channel.send(`There was an error!\n\`${error.response.status} || ${error.response.statusText}`);
            } else {
                console.error(error);
                message.channel.send(`There was an error!\n\`${error}\``)
            }
        }
    }
};

module.exports = command;