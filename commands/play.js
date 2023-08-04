const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { SpotifyExtractor } = require("@discord-player/extractor");

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
    if (music.includes("https://open.spotify.com/")) {

      music = music.split("?")[0];

      if (music.includes("https://open.spotify.com/track/")) {
        // music = music.replace("https://open.spotify.com/track/", "");
        //Remove string after ? if the link has ? in the end

        console.log(music);
        const track = await global.Player.search(music, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
          fallbackSearchEngine: "spotifySong",
        }).then((x) => {
          console.log(x.tracks);
          return x.tracks[0];
        });
        trackInfo = track;
        console.log(trackInfo);
        if (!track)
          return await interaction.followUp({
            content: `❌ | Track **${music}** not found!`,
          });
        await queue.node.play(track);

      } else if (music.includes("https://open.spotify.com/playlist/")) {
        const track = await global.Player.search(music, {
          requestedBy: interaction.user,
          searchEngine: QueryType.SPOTIFY_PLAYLIST,
          fallbackSearchEngine: "spotifyPlaylist",
        }).then((x) => {
          // console.log(x.tracks[0]);
          return x.tracks;
        });

        //Map the track to get the track info
        trackInfo = track.map((x) => x.title);

        // console.log(trackInfo);
        if (!track)
          return await interaction.followUp({
            content: `❌ | Track **${music}** not found!`,
          });

        //put playlist to queue
        await queue.addTrack(track);

        //Check if the bot is already playing music
      if (!queue.isPlaying()) {
        console.log("not playing");
        await queue.node.play();
      } 

      } else {
      }
    } else {
      const track = await global.Player.search(music, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      }).then((x) => x.tracks[0]);
      trackInfo = track;
      //Map the track to get the track info
      if (!track)
        return await interaction.followUp({
          content: `❌ | Track **${music}** not found!`,
        });

      await queue.node.play(track);
      
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: (Array.isArray(trackInfo)) ? `Track ${trackInfo.slice(0,5).join("\n")} added in the queue ✅ ` : `Track ${trackInfo.title} added in the queue ✅` ,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor("#13f857");

    return await interaction.followUp({ embeds: [embed] });

    trackInfo = "";
  },
};
