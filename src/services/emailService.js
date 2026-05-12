// Email notification service
// Uses EmailJS for sending emails from the client-side

// Template for sending volunteer status notifications
export const sendVolunteerStatusEmail = async (volunteer, status, message = '') => {
  try {
    // Compose email based on status
    let subject = '';
    let emailBody = '';

    if (status === 'approved') {
      subject = 'Congratulations! Your Volunteer Application Has Been Approved';
      emailBody = `
Dear ${volunteer.name},

Great news! Your volunteer application for IEEE WIE SUSL has been approved.

We're excited to have you on our team! You will receive further instructions about upcoming events and training sessions shortly.

Best regards,
IEEE WIE SUSL Team
      `;
    } else if (status === 'rejected') {
      subject = 'Regarding Your Volunteer Application';
      emailBody = `
Dear ${volunteer.name},

Thank you for your interest in volunteering with IEEE WIE SUSL. 

Unfortunately, we are unable to process your application at this time. However, we encourage you to apply again in the future.

Best regards,
IEEE WIE SUSL Team
      `;
    }

    // For now, we'll simulate sending the email and log it
    // In production, integrate with EmailJS or a backend service
    console.log('📧 Email would be sent to:', volunteer.email);
    console.log('Subject:', subject);
    console.log('Body:', emailBody);

    // If you want to use real emails, uncomment and setup EmailJS:
    // import emailjs from '@emailjs/browser';
    // await emailjs.send(
    //   'service_id',
    //   'template_id',
    //   {
    //     to_email: volunteer.email,
    //     to_name: volunteer.name,
    //     subject: subject,
    //     message: emailBody,
    //   }
    // );

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendContactReplyEmail = async (message, replyText) => {
  try {
    let emailBody = `
Dear ${message.name},

Thank you for contacting IEEE WIE SUSL. We have received your message and will get back to you shortly.

Your message: "${message.message}"

Best regards,
IEEE WIE SUSL Team
    `;

    console.log('📧 Email would be sent to:', message.email);
    console.log('Body:', emailBody);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
