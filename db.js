//Connect to MongoDB by using mongoose
const mongoose = require('mongoose');
const config = require('./config');
mongoose.connect(config.mongodbUrl + '/discordbot', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));
