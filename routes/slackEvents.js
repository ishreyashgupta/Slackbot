const { slackApp } = require('../appInstance');

const slackEventsHandler = async (req, res) => {
  const body = req.body;
  console.log('Received Slack event:', body);  // Added log to display the event received

  // URL Verification
  if (body.type === 'url_verification') {
    console.log('Handling URL verification with challenge:', body.challenge);
    res.status(200).send(body.challenge); // Respond with the challenge token to verify the URL
    return;
  }

  // Check if it's a modal submission (approval modal)
  if (body.type === 'view_submission') {
    console.log('Handling view_submission event:', body);  // Added log for view submission

    const approverIds = body.view.state.values.approver_select.approver_select.selected_options.map(option => option.value); // Multiple approvers
    const approvalText = body.view.state.values.approval_text.approval_input.value;
    const requesterId = body.user.id; // Store the requester's ID (user who triggered the modal)
    const followUpTime = body.view.state.values.follow_up_time.follow_up_time.selected_option.value; // Get selected follow-up time
    
    console.log('Captured Values:');
    console.log(`Approver IDs: ${approverIds}`);
    console.log(`Approval Text: ${approvalText}`);
    console.log(`Requester ID: ${requesterId}`);
    console.log(`Follow-up Time: ${followUpTime}`);

    // Check if approverIds are valid (not empty)
    if (approverIds.length === 0) {
        console.error('Error: No approvers selected!');
        return res.status(400).send('No approvers selected');
    }

    // Prepare the message data for approval request
    const messageData = {
      channel: approverIds[0], // Send the message to the first approver (you can modify this to send to all approvers)
      text: `You have a new approval request:\n\n${approvalText}`,
      attachments: [
        {
          text: 'Do you approve or reject this request?',
          fallback: 'You are unable to approve or reject this request',
          callback_id: 'approval_response',
          state: JSON.stringify({ requesterId }), // Store the requester ID in state
          actions: [
            {
              name: 'approve',
              text: 'Approve',
              type: 'button',
              value: 'approve',
              style: 'primary',
            },
            {
              name: 'reject',
              text: 'Reject',
              type: 'button',
              value: 'reject',
              style: 'danger',
            },
          ],
        },
      ],
    };

    // Send the approval request to the selected approvers
    try {
      const result = await slackApp.client.chat.postMessage(messageData);
      console.log('Approval request sent to approvers:', result);
      return res.status(200).send();  // Successfully sent the message
    } catch (error) {
      console.error('Error sending approval request:', error);
      return res.status(500).send('Error sending approval request');
    }
  }

  // If the event doesn't match view_submission, process as other Slack events
  console.log('Processing other event');
  res.status(200).send(); // Respond with a success status after event handling
};

module.exports = { slackEventsHandler };
