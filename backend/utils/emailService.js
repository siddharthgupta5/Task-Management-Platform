const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send task assignment notification
const sendTaskAssignmentEmail = async (userEmail, userName, taskTitle, taskId) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'New Task Assigned - Task Management Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Task Assigned</h2>
          <p>Hello ${userName},</p>
          <p>A new task has been assigned to you:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin: 0; color: #555;">${taskTitle}</h3>
            <p style="margin: 10px 0 0 0;">Task ID: ${taskId}</p>
          </div>
          <p>Please log in to the Task Management Platform to view the full details and start working on this task.</p>
          <a href="${process.env.FRONTEND_URL}/tasks/${taskId}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Task
          </a>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            This is an automated message from the Task Management Platform.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Task assignment email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending task assignment email:', error);
  }
};

// Send task completion notification
const sendTaskCompletionEmail = async (userEmail, userName, taskTitle, taskId) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Task Completed - Task Management Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Task Completed</h2>
          <p>Hello ${userName},</p>
          <p>The following task has been marked as completed:</p>
          <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="margin: 0; color: #155724;">${taskTitle}</h3>
            <p style="margin: 10px 0 0 0;">Task ID: ${taskId}</p>
          </div>
          <p>Great job on completing this task!</p>
          <a href="${process.env.FRONTEND_URL}/tasks/${taskId}" 
             style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Task
          </a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Task completion email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending task completion email:', error);
  }
};

// Send task due date reminder
const sendTaskReminderEmail = async (userEmail, userName, taskTitle, taskId, dueDate) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Task Due Date Reminder - Task Management Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffc107;">Task Due Date Reminder</h2>
          <p>Hello ${userName},</p>
          <p>This is a reminder that the following task is due soon:</p>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="margin: 0; color: #856404;">${taskTitle}</h3>
            <p style="margin: 10px 0 0 0;">Due Date: ${new Date(dueDate).toLocaleDateString()}</p>
            <p style="margin: 5px 0 0 0;">Task ID: ${taskId}</p>
          </div>
          <p>Please ensure you complete this task before the due date.</p>
          <a href="${process.env.FRONTEND_URL}/tasks/${taskId}" 
             style="background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Task
          </a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Task reminder email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending task reminder email:', error);
  }
};

module.exports = {
  sendTaskAssignmentEmail,
  sendTaskCompletionEmail,
  sendTaskReminderEmail
};