const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
  name: "stop",
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop the music"),
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
      await interaction.deferReply();

      const queue = useQueue(interaction.guild.id);
      
      //Check is there any music is playing
      

    // if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played! or No any music in the queue" });
        
        const success = queue.delete();


        return void interaction.followUp({

            content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!"

        });
  },
};
