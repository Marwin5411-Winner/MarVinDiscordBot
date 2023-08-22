const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

//Import QueryType
const { QueryType, Playlist } = require("discord-player");
module.exports = {
  name: "play",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play the music")
    .addStringOption((option) =>
      option
        .setName("music")
        .setDescription("ใส่เพลง/input your music")
        .setRequired(true)
    ),
  async execute(interaction) {
    //Check member is in VC
    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
    //Check member is in same voice channel
    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({
        content: "You are not in my voice channel!",
        ephemeral: true,
      });
    if (!interaction.options.getString("music"))
      return await interaction.reply({
        content: "Please specify a music!",
        ephemeral: true,
      });
    var music = interaction.options.getString("music");
    const queue = await global.Player.nodes.create(interaction.guild, {
      metadata: interaction.channel,
    });

    //Check if the bot is already connected to the voice channel
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channelId);

    //TODO: Fix when has music is playing push a new music to the queue
    await interaction.deferReply();
    //Select platform to search music
    let trackInfo;
    let trackThumbnail;
    let trackUrl;
    if (music.includes("https://open.spotify.com/")) {
      console.log(music.split("?")[0]);
      music = music.split("?")[0];
      if (music.includes("https://open.spotify.com/track/")) {
        // music = music.replace("https://open.spotify.com/track/", "");
        //Remove string after ? if the link has ? in the end
        console.log(music);
        const track = await global.Player.search(music, {
          requestedBy: interaction.user,
          searchEngine: QueryType.SPOTIFY_SONG,
          fallbackSearchEngine: "spotifySong",
        }).then((x) => {
          console.log(x.tracks);
          return x.tracks[0];
        });

        if (!track)
          return await interaction.followUp({
            content: `❌ | Track **${music}** not found! Sorry for the inconvenience! This bug is from Spotify API! You can use Album or Playlist link instead!`,
          });

        trackInfo = `Add Song **${track.title}** - ${track.author} (requested by : ${track.requestedBy.username}) From ${track.raw.source}`;
        trackThumbnail = track.thumbnail;
        trackUrl = track.url;

        await queue.node.play(track);
      } else if (music.includes("https://open.spotify.com/playlist/")) {
        const track = await global.Player.search(music, {
          requestedBy: interaction.user,
          searchEngine: QueryType.SPOTIFY_PLAYLIST,
          fallbackSearchEngine: "spotifyPlaylist",
        }).then((x) => {
          //console.log(x);
          return x;
        });
        // console.log(trackInfo);
        if (!track.tracks || track.playlist === null)
          return await interaction.followUp({
            content: `❌ | Track **${music}** not found! or playlist is private!`,
          });

        trackInfo = `Add Playlist **${track.playlist.description}** - ${track.playlist.tracks.length} tracks (requested by : ${track.tracks[0].requestedBy.username}) From ${track.playlist.source}`;
        trackThumbnail = track.playlist.thumbnail;
        trackUrl = track.playlist.url;

        //put playlist to queue
        await queue.addTrack(track.tracks);

        //Check if the bot is already playing music
        if (!queue.isPlaying()) {
          console.log("not playing");
          await queue.node.play();
        }
      } else if (music.includes('https://open.spotify.com/album/')) {
        const track = await global.Player.search(music, {
          requestedBy: interaction.user,
          searchEngine: QueryType.SPOTIFY_ALBUM,
          fallbackSearchEngine: "spotifyAlbum",
        }).then((x) => {
          console.log(x);
          return x;
        });
        // console.log(trackInfo);
        if (!track.tracks || track.playlist === null)
          return await interaction.followUp({
            content: `❌ | Track **${music}** not found! or playlist is private!`,
          });

        trackInfo = `Add Playlist **${track.playlist.description}** - ${track.playlist.tracks.length} tracks (requested by : ${track.tracks[0].requestedBy.username}) From ${track.playlist.source}`;
        trackThumbnail = track.playlist.thumbnail;
        trackUrl = track.playlist.url;

        //put playlist to queue
        await queue.addTrack(track.tracks);

        //Check if the bot is already playing music
        if (!queue.isPlaying()) {
          console.log("not playing");
          await queue.node.play();
        }
      }
    } else {
      const track = await global.Player.search(music, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      }).then((x) => x.tracks[0]);
      console.log(track);
      trackInfo = `Add Song **${track.title}** - ${track.author} (requested by : ${track.requestedBy.username}) From ${track.raw.source} `;
      trackUrl = track.url;
      trackThumbnail = track.thumbnail;
      //Map the track to get the track info
      if (!track)
        return await interaction.followUp({
          content: `❌ | Track **${music}** not found!`,
        });

      await queue.node.play(track);
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: trackInfo,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setURL(trackUrl)
      .setImage(trackThumbnail)
      .setColor("#13f857");

    return await interaction.followUp({ embeds: [embed] });

    trackInfo = "";
  },
};
