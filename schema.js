const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  lastVideoId: { type: String, required: true },
  lastVideoDate: { type: String },
}, {
    collection: 'youtubeNotification',
});

exports.Notification = mongoose.model('Notification', notificationSchema);

