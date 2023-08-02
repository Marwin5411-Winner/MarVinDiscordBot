const { Player } = require("discord-player");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { YouTubeExtractor } = require("@discord-player/extractor");
const fs = require("node:fs");
const path = require("node:path");
global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  disableMentions: "everyone",
});

client.config = require("./config");

process.on("uncaughtException", function (err) {
  if (!err.stack?.includes("ERR_STREAM_PREMATURE_CLOSE")) {
    console.error(err.stack);
    exitHandler.bind(null, { exit: true, signal: "uncaughtException" });
  }
});

global.Player = new Player(client, client.config.opt.discordPlayer);
global.Player.extractors.register(YouTubeExtractor);

require("./src/loader.js");
require("./src/events.js");


client.login(client.config.app.token);

