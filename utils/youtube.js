const { EmbedBuilder } = require("discord.js");
const config = require("../config");
const channelId = config.youtubeChannelId;
const apiKey = config.youtubeApiKey;
const mongoose = require('mongoose');
const { Notification } = require('../schema');
let lastVideoData;


/**
 * Convert Channel ID to Playlist ID
 * @param {string} channelId
 * @returns {string}
 */
const getPlaylistId = (channelId) => {
    channelId = channelId.replace(/UC/, "");
    return `UU${channelId}`;
};

/**
 * Query Youtube Playlist Data API
 * @param {string} playlistId
 * @returns {Promise<PlaylistData>}
 * @see https://developers.google.com/youtube/v3/docs/playlists/list
    */
const getPlaylistData = async (playlistId) => {
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0];
};

/**
 * Store Last Video Data to Local Storage Or Databse and Check is New uploaded Video
 * @param {PlaylistData} playlistData
 * @returns {boolean}
 * */
async function isNewVideo (playlistData) {
    const videoData = playlistData.snippet;
    const videoId = videoData.resourceId.videoId;
    //Query Database
    const lastVideo = await Notification.findOne({ channelId: channelId });

    if (lastVideo === null) {
        //Store Last Video Data to Database
        const notification = new Notification({
            channelId: channelId,
            lastVideoId: videoId,
            lastVideoDate: videoData.publishedAt,
        });
        notification.save();
        return true;
    }
    if (lastVideo.lastVideoId === videoId) {
        return false;
    }

    console.log(videoId)
    console.log(lastVideo?.lastVideoId || "null")

    //Update Last Video Data to Database
    lastVideo.lastVideoId = videoId;
    lastVideo.lastVideoDate = videoData.publishedAt;
    lastVideo.save();
    return true;
}


//Main Function
const checkNewVideo = async () => {
    const playlistId = getPlaylistId(channelId);
    const playlistData = await getPlaylistData(playlistId);
    const result = await isNewVideo(playlistData);
    console.log(result);
    if (result === true) {
        console.log("New Video!" + playlistData.snippet.title);
        return playlistData;
            // .setFooter("Youtube", "https://cdn.discordapp.com/attachments/881978835658668288/882000000000000000/YouTube_social_white_square.png");
        //Send Message to Discord Channe;
    } else {
        console.log("No New Video!");
    }
};

module.exports = { checkNewVideo };


