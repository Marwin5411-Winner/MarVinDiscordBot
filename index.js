const { Player } = require("discord-player");
const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js");
const { BridgeProvider, BridgeSource } = require("@discord-player/extractor");
const fs = require("node:fs");
const path = require("node:path");
const cron = require("node-cron");
const { checkNewVideo } = require("./utils/youtube.js");



global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
  disableMentions: "everyone",
});

global.Player = new Player(client, {
  leaveOnEnd: true,
});
global.Player.extractors.loadDefault();







client.config = require("./config");

if (client.config.youtubeChannelId && client.config.youtubeApiKey && client.config.mongodbUrl && client.config.discordNotificationChannelId) {
require('./db');
cron.schedule('*/2 * * * *', async () => {
  try {
  const playlistData = await checkNewVideo();
  if (!playlistData) return;
  const channel = client.channels.cache.get(client.config.discordNotificationChannelId);
  const embed = new EmbedBuilder()
  .setTitle(playlistData.snippet.title)
  .setURL(`https://www.youtube.com/watch?v=${playlistData.snippet.resourceId.videoId}`)
  .setThumbnail(playlistData.snippet.thumbnails.default.url)
  .setDescription(playlistData.snippet.description || "No Description")
  .setTimestamp(new Date(playlistData.snippet.publishedAt))
  .setImage(playlistData.snippet.thumbnails.high.url)
  .setColor("#FF0000")
  channel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
  console.log('Run task every minute');
});

client.on(Events.ClientReady, async (message) => {
  try {
    const playlistData = await checkNewVideo();
    if (!playlistData) return;
  const channel = client.channels.cache.get(client.config.discordNotificationChannelId);
  const embed = new EmbedBuilder()
  .setTitle(playlistData.snippet.title)
  .setURL(`https://www.youtube.com/watch?v=${playlistData.snippet.resourceId.videoId}`)
  .setThumbnail(playlistData.snippet.thumbnails.default.url)
  .setDescription(playlistData.snippet.description || "No Description")
  .setTimestamp(new Date(playlistData.snippet.publishedAt))
  .setImage(playlistData.snippet.thumbnails.high.url)
  .setColor("#FF0000")
  channel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
});

}

process.on("uncaughtException", function (err) {
  if (!err.stack?.includes("ERR_STREAM_PREMATURE_CLOSE")) {
    console.error(err.stack);
    exitHandler.bind(null, { exit: true, signal: "uncaughtException" });
  }
});

//Catch all errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  //Send Webhook to Discord
  fetch('https://discord.com/api/webhooks/1139233452017860621/SxKuESBVox9CbpuLL9INWP0UTiAoS2CoThC4Bi8YpBmqTuzepbB9BZT5wxs2RJ_WU7Zm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `Bot Name : ${client.user.tag}\nError : ${reason}\nPromise : ${promise}`
        }),
      })
});





require("./src/loader.js");
require("./src/events.js");




client.login(client.config.app.token);

