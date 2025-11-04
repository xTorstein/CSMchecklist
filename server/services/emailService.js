const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send checklist email to admin
async function sendChecklistEmail({ lecturerName, lecturerEmail, subjectName, dateNeeded, items, additionalNotes, checklistId }) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('ADMIN_EMAIL not configured');
      return;
    }

    // Format items list
    const itemsList = items.map((item, index) => {
      const quantity = item.quantity ? ` (${item.quantity})` : '';
      return `${index + 1}. ${item.name}${quantity}`;
    }).join('\n');

    // Email content
    const emailContent = `
Nowa checklista została przesłana przez wykładowcę.

Szczegóły:
- Wykładowca: ${lecturerName}
- Email: ${lecturerEmail}
- Przedmiot: ${subjectName}
- Data potrzebna: ${dateNeeded}
- ID Checklisty: ${checklistId}

Potrzebne materiały:
${itemsList}

${additionalNotes ? `Dodatkowe uwagi:\n${additionalNotes}` : ''}

---
Wiadomość wygenerowana automatycznie przez system CSM Checklist
    `.trim();

    const mailOptions = {
      from: `"CSM Checklist" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Nowa checklista - ${subjectName} (${dateNeeded})`,
      text: emailContent,
      html: `
        <h2>Nowa checklista została przesłana</h2>
        <p><strong>Wykładowca:</strong> ${lecturerName}</p>
        <p><strong>Email:</strong> ${lecturerEmail}</p>
        <p><strong>Przedmiot:</strong> ${subjectName}</p>
        <p><strong>Data potrzebna:</strong> ${dateNeeded}</p>
        <p><strong>ID Checklisty:</strong> ${checklistId}</p>
        
        <h3>Potrzebne materiały:</h3>
        <ul>
          ${items.map(item => `<li>${item.name}${item.quantity ? ` (${item.quantity})` : ''}</li>`).join('')}
        </ul>
        
        ${additionalNotes ? `<p><strong>Dodatkowe uwagi:</strong><br>${additionalNotes}</p>` : ''}
        
        <hr>
        <p style="color: #666; font-size: 12px;">Wiadomość wygenerowana automatycznie przez system CSM Checklist</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  sendChecklistEmail
};

