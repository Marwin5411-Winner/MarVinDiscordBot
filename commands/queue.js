const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
    name: "queue",
    data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Get a queue"),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ content: `No music currently playing ${interaction.member}... try again ? ❌`, ephemeral: true });

        if (!queue.tracks.toArray()[0]) return  interaction.reply({ content: `No music in the queue after the current one ${interaction.member}... try again ? ❌`, ephemeral: true });

        const songs = queue.tracks.toArray().length;

        const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`)

        const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
        .setAuthor({name: `Server queue - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
        .setDescription(`Current ${queue.currentTrack.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
        .setTimestamp()
        .setFooter({ text: 'MarVin Developier Bot Code Base By MarVin', iconURL: interaction.member.avatarURL({ dynamic: true })})

        interaction.reply({ embeds: [embed] });
    }
}