const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
  name: "skip",
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skip the music"),
  async execute(interaction) {
    //Create skip function for skip the music in the queue or skip the current music and play the next music in the queue or stop the music if there is no music in the queue
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
      await interaction.deferReply();

      const queue = useQueue(interaction.guild.id);
      console.log(queue.tracks.toArray());
      //Check is there any music is playing

      if (queue.tracks.toArray().length === 0) {
        //stop the music if there is no music in the queue
        await queue.delete();
        return void interaction.followUp({
          content: "❌ | No music is being played! or No any music in the queue or stop the music if there is no music in the queue",
        });
      }

      const success = queue.node.skip();

      return void interaction.followUp({
        content: success
          ? `✅ | Skipped!`
          : "❌ | Something went wrong!",
      });
  },
};
