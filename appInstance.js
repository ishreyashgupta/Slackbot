const { App } = require('@slack/bolt');

// Initialize Slack Bolt app
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

module.exports = { slackApp };
