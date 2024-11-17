# Slack App with Express and Bolt

## Overview
This repository contains a Node.js project that sets up a Slack app using Express.js and the Slack Bolt framework. The application listens for various Slack events and processes interactions, such as slash commands and modal view submissions, enabling a streamlined user approval workflow.

## Features
- Listens for and processes Slack events and interactions.
- Responds to `/approval-test` slash command by opening a modal.
- Handles user submissions for approval workflows.
- Integrates middleware to capture raw request bodies for secure event validation.
- Provides robust logging and error handling.

## Prerequisites
Ensure you have the following installed:
- Node.js (v14.x or higher)
- npm (v6.x or higher)
- A Slack workspace and a registered Slack app with the appropriate scopes.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

   Your `package.json` should include the following dependencies:
   ```json
   {
     "dependencies": {
       "@slack/bolt": "^4.1.0",
       "@slack/web-api": "^7.7.0",
       "axios": "^1.7.7",
       "body-parser": "^1.20.3",
       "dotenv": "^16.4.5",
       "express": "^4.21.1",
       "nodemon": "^3.1.7"
     }
   }
   ```

3. **Create an Environment File**
   Create a `.env` file in the root directory and add the following environment variables:
   ```env
   SLACK_SIGNING_SECRET=<your-signing-secret>
   SLACK_BOT_TOKEN=<your-bot-token>
   PORT=3000  # or any preferred port
   ```

4. **Run the Application**
   ```bash
   node app.js
   ```

5. **Expose the Server to the Internet**
   Use a tool like [ngrok](https://ngrok.com/) to expose your local server for Slack to reach your app:
   ```bash
   ngrok http 3000
   ```
   Update your Slack app’s **Request URL** with the public ngrok URL.

## About ngrok
ngrok is a tool that provides a secure tunnel from a public endpoint to a local server. This allows Slack to communicate with your local development environment by forwarding traffic from an ngrok URL to your local server. This is particularly useful for testing interactions and event handling during development.

## Slack App Configuration

1. **Register the App**
   - Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app.

2. **Set Up Event Subscriptions**
   - Enable **Event Subscriptions**.
   - Add your **Request URL** (e.g., `https://<your-ngrok-url>/slack/events`).

3. **Subscribe to Bot Events**
   - Add `url_verification`, `view_submission`, and any other relevant event types.

4. **Add Slash Commands**
   - Create a new command (`/approval-test`) with the **Request URL** pointing to `https://<your-ngrok-url>/slack/commands`.

## Event and Slash Command URL Handling
- **Event URL**: This is the endpoint where Slack sends events to your app. It should be configured in your app as `https://<your-ngrok-url>/slack/events`.
- **Slash Command URL**: This endpoint handles the incoming slash commands and should be set as `https://<your-ngrok-url>/slack/commands`.

## Project Structure
```
.
|-- app.js                     # Main server file
|-- appInstance.js             # App instance setup
|-- middleware/
|   |-- rawBodyMiddleware.js   # Middleware for raw body parsing
|-- routes/
|   |-- slackcommand.js        # Handles slash commands
|   |-- slackevent.js          # Handles event subscriptions
|-- package.json               # Project metadata and dependencies
|-- .env                       # Environment configuration (not included in repo)
|-- README.md                  # Project documentation
```

## Key Components

### app.js
- Sets up an Express server and integrates the Slack Bolt app.
- Handles Slack event verification and interactions.
- Manages `/approval-test` command processing and modal display.

### appInstance.js
- Configures and initializes the Slack Bolt app instance.

### routes/slackcommand.js
- Handles slash command requests from Slack.

### routes/slackevent.js
- Handles various Slack events, such as `url_verification` and `view_submission`.

### middleware/rawBodyMiddleware.js
- Parses raw request bodies to ensure proper signature verification for Slack events.

## Usage
- Use the `/approval-test` slash command in your Slack workspace to trigger a modal.
- Fill out and submit the modal to test the approval workflow.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributions
Contributions are welcome! Feel free to submit a PR or report issues.

## Troubleshooting
- Ensure the **Request URL** is valid and accessible from Slack.
- Verify the environment variables are correctly set.
- Check the ngrok session hasn’t expired or changed.

