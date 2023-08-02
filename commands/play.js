const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  name: "play",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play the music")
    .addStringOption(option =>
		option.setName('music')
			.setDescription('ใส่เพลง/input your music')
			.setRequired(true)),
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
    if (!interaction.options.getString("music")) return await interaction.reply({
      content: "Please specify a music!",
      ephemeral: true,
    });
    const music = interaction.options.getString("music");
    const queue = await global.Player.nodes.create(interaction.guild, {
      metadata: interaction.channel,
    });

    //Check if the bot is already connected to the voice channel
    if (!queue.connection) await queue.connect(interaction.member.voice.channelId);

    //TODO: Fix when has music is playing push a new music to the queue
    await interaction.deferReply();
    const track = await global.Player
      .search(music, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.followUp({
        content: `❌ | Track **${music}** not found!`,
      });
      await queue.node.play(track);

    return await interaction.followUp({
      content: `⏱️ | Loading track **${track.title}**!`,
    });
  },
};
