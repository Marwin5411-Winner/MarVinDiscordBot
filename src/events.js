const {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("discord.js");

global.Player.events.on("error", (queue, error) => {
  console.log(`Error emitted from the queue ${error.message}`);
});

global.Player.events.on("playerError", (queue, error) => {
  console.log(`Error emitted from the connection ${error.message}`);
});

global.Player.events.on("playerStart", (queue, track) => {
  queue.metadata.send(`🎶 | Now playing **${track.title}**!`)
  // console.log(track);
  console.log('queue', queue.currentTrack.title);
}
);

global.Player.events.on("audioTrackAdd", (queue, track) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Track ${track.title} added in the queue ✅`,
      iconURL: track.requestedBy.avatarURL(),
    })
    .setColor("#13f857");
  queue.metadata.send({ embeds: [embed] });
});

global.Player.events.on("disconnect", (queue) => {
  // queue.metadata.send(
  //   "I was disconnected from the voice channel"
  // );
});

global.Player.events.on("emptyChannel", (queue) => {
  queue.metadata.send(
    "Nobody is in the voice channel, leaving the voice channel... ❌"
  );
});

global.Player.events.on("emptyQueue", (queue) => {
    queue.metadata.send(`Music is ended successfully`)
});

//Add Music Playlist To Queue
global.Player.events.on("playlistAdd", (queue, playlist) => {
  queue.metadata.send(
    `🎶 | Adding **${playlist.tracks.length}** tracks in the queue!`
  );
}
);

global.Player.events.on('error', (queue, error) => {
  // Emitted when the player queue encounters error
  console.log(`General player error event: ${error.message}`);
  console.log(error);
});

global.Player.events.on('playerError', (queue, error) => {
  // Emitted when the audio player errors while streaming audio track
  console.log(`Player error event: ${error.message}`);
  console.log(error);
});

global.Player.on('debug', async (message) => {
  // Emitted when the player sends debug info
  // Useful for seeing what dependencies, extractors, etc are loaded
  console.log(`General player debug event: ${message}`);
});