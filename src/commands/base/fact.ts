import * as Discord from "discord.js";
import  axios, { AxiosResponse } from "axios";
import { Command } from "../../typings/types";
import Link from "../../classes/Link";
import { axiosErrorHandler, charChecker } from "../../utils";

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

export default {
    name: "fact",
    aliases: ["facts"],
    description: "Gets a random fact using the [Useless Facts](https://uselessfacts.jsph.pl/random.html?language=en) API.",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {            
            const link = new Link("/random.json", "https://uselessfacts.jsph.pl/", {
                querystring: {
                    language: "en"
                },
                headers: {
                    "Accept": "application/json"
                }
            });
            
            const { data }: Response = await axios.get(link.href, {headers: link.headers});

            const embed = new Discord.MessageEmbed()
                .setColor("#fff")
                .setTitle("Random Fact")
                .setDescription(charChecker(data.text))
                .setURL(data.permalink)
                .setFooter(data.source);

            message.channel.send(embed);
        } catch (error: any) {
            axiosErrorHandler(message, error);
        }
    }
} as Command;