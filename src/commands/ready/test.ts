import * as Discord from "discord.js";

export default async function (client: Discord.Client): Promise<void> {
    try {
        console.log("Test");
    } catch (err) {
        throw new Error(err);
    }
}