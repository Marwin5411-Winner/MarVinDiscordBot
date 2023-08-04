const { Player } = require("discord-player");
const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js");
const { YouTubeExtractor, SpotifyExtractor } = require("@discord-player/extractor");
const fs = require("node:fs");
const path = require("node:path");
const cron = require("node-cron");
const { checkNewVideo } = require("./utils/youtube.js");

cron.schedule('* * * * *', () => {
  
  console.log('Run task every minute');
});



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
//Send embed to specific channel


client.config = require("./config");

if (client.config.youtubeChannelId && client.config.youtubeApiKey && client.config.mongodbUrl) {
require('./db');
cron.schedule('2 * * * *', async () => {
  try {
  const playlistData = await checkNewVideo();
  if (!playlistData) return;
  const channel = client.channels.cache.get("1136680244212936916");
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
  const channel = client.channels.cache.get("1136680244212936916");
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



global.Player = new Player(client, client.config.opt.discordPlayer);
global.Player.extractors.register(YouTubeExtractor, {});
// global.Player.extractors.register(SpotifyExtractor, {});

require("./src/loader.js");
require("./src/events.js");




client.login(client.config.app.token);

