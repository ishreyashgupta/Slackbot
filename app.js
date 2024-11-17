const express = require('express');
const { App } = require('@slack/bolt');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

// Import custom modules
const { slackApp } = require('./appInstance');
const { slackEventsHandler } = require('./routes/slackEvents');
const { slackCommandsHandler } = require('./routes/slackCommands');
const { rawBodyMiddleware } = require('./middleware/rawBodyMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing application/json and urlencoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to capture raw body for Slack signature verification
app.use(rawBodyMiddleware);

// Slack events route
app.post('/slack/events', slackEventsHandler);

// Slack slash command route
app.post('/slack/commands', slackCommandsHandler);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start the Slack app
(async () => {
  await slackApp.start();
  console.log('Slack app is running!');
})();
