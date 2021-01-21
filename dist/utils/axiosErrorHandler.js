"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosErrorHandler = void 0;
const axiosErrorHandler = (message, err) => {
    if (err.response) {
        console.error(err.response);
        message.channel.send(`There was an error!\n\`${err.response.status} || ${err.response.statusText}\n${err.response.data.error}\``);
    }
    else if (err.request) {
        console.error(err.request);
        message.channel.send(`There was an error!\n\`Request made but no Response received\``);
    }
    else {
        console.error(err);
        message.channel.send(`There was an error!\n\`${err}\``);
    }
};
exports.axiosErrorHandler = axiosErrorHandler;
