const { slackApp } = require('../appInstance');

const slackCommandsHandler = async (req, res) => {
  console.log('Received Slack slash command:', req.body);  // Added log to capture slash command data
  const { command, trigger_id } = req.body;

  if (command === '/approval-test') {
    console.log('Handling /approval-test command');
    try {
      // Fetch the members of the Slack workspace
      const result = await slackApp.client.users.list();
      console.log('Fetched users list from Slack:', result);
      const users = result.members.filter(user => !user.is_bot); // Filter out bots

      // Create a list of users for the approver dropdown
      const options = users.map(user => ({
        text: { type: 'plain_text', text: user.real_name || user.name },
        value: user.id,
      }));

      // Create the follow-up time options for the dropdown
      const timeOptions = [
        { text: { type: 'plain_text', text: '1 hour' }, value: '1' },
        { text: { type: 'plain_text', text: '2 hours' }, value: '2' },
        { text: { type: 'plain_text', text: '3 hours' }, value: '3' },
        { text: { type: 'plain_text', text: '4 hours' }, value: '4' },
        { text: { type: 'plain_text', text: '5 hours' }, value: '5' },
      ];

      // Open a modal with the input fields
      await slackApp.client.views.open({
        trigger_id: trigger_id,
        view: {
          type: 'modal',
          callback_id: 'approval_modal',
          title: {
            type: 'plain_text',
            text: 'Approval Request',
          },
          submit: {
            type: 'plain_text',
            text: 'Submit',
          },
          blocks: [
            {
              type: 'section',
              block_id: 'approver_select',
              text: {
                type: 'mrkdwn',
                text: 'Select Approvers (multiple allowed)',
              },
              accessory: {
                type: 'multi_static_select',  // Allows multiple selections
                action_id: 'approver_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'Select approvers',
                },
                options: options,  // List of approvers fetched earlier
              },
            },
            {
              type: 'input',
              block_id: 'approval_text',
              label: {
                type: 'plain_text',
                text: 'Enter the approval text:',
              },
              element: {
                type: 'plain_text_input',
                action_id: 'approval_input',
                multiline: true,
                placeholder: {
                  type: 'plain_text',
                  text: 'Write your approval request...',
                },
              },
            },
            {
              type: 'section',
              block_id: 'follow_up_timer',
              text: {
                type: 'mrkdwn',
                text: 'Select a follow-up time (in hours):',
              },
              accessory: {
                type: 'static_select',
                action_id: 'follow_up_time',
                placeholder: {
                  type: 'plain_text',
                  text: 'Choose time in hours',
                },
                options: timeOptions,  // Corrected time options
              },
            },
          ],
        },
      });
      console.log('Modal opened successfully');
      res.status(200).send(); // Respond to Slack to acknowledge the request
    } catch (error) {
      console.error('Error opening modal:', error);
      res.status(500).send('Error opening modal');
    }
  } else {
    console.log('Command not found:', command);
    res.status(404).send('Command not found');
  }
};

module.exports = { slackCommandsHandler };
