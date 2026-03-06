const nodemailer = require('nodemailer');

// Validate SMTP configuration
function validateSMTPConfig() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.');
    return false;
  }
  if (!process.env.ADMIN_EMAIL) {
    console.error('ADMIN_EMAIL not configured. Please set ADMIN_EMAIL environment variable.');
    return false;
  }
  return true;
}

// Create transporter function - creates transporter if config is valid
function createTransporter() {
  if (!validateSMTPConfig()) {
    return null;
  }
  
  try {
    const port = parseInt(process.env.SMTP_PORT);
    const smtpPort = (port && !isNaN(port)) ? port : 587;
    
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } catch (error) {
    console.error('Error creating transporter:', error.message);
    return null;
  }
}

// Create transporter only if credentials are available
let transporter = createTransporter();
if (transporter) {
  console.log('✅ [EMAIL] Transporter SMTP utworzony pomyślnie');
} else {
  console.warn('⚠️ [EMAIL] Transporter SMTP nie został utworzony - brak konfiguracji');
}

// Send checklist email to admin
async function sendChecklistEmail({ lecturerName, lecturerEmail, subjectName, dateNeeded, items, additionalNotes, checklistId }) {
  console.log('📧 [EMAIL] Rozpoczynanie wysyłki email dla checklisty ID:', checklistId);
  
  try {
    // Recreate transporter if it doesn't exist (in case env vars changed)
    if (!transporter) {
      console.log('🔄 [EMAIL] Próba ponownego utworzenia transportera...');
      transporter = createTransporter();
    }
    
    // Validate configuration
    if (!validateSMTPConfig() || !transporter) {
      console.error('❌ [EMAIL] Email service not properly configured. Skipping email send.');
      console.error('   Transporter exists:', !!transporter);
      console.error('   SMTP_USER:', process.env.SMTP_USER ? 'SET (' + process.env.SMTP_USER + ')' : 'NOT SET');
      console.error('   SMTP_PASS:', process.env.SMTP_PASS ? 'SET (***)' : 'NOT SET');
      console.error('   ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET');
      return; // Returns resolved promise
    }

    // Validate input data
    if (!items || !Array.isArray(items)) {
      console.error('❌ [EMAIL] Invalid items data provided to email service');
      return; // Returns resolved promise
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const smtpUser = process.env.SMTP_USER;
    
    console.log('📧 [EMAIL] Wysyłanie do:', adminEmail);
    console.log('📧 [EMAIL] Od:', smtpUser);

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
      from: `"CSM Checklist" <${smtpUser}>`,
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

    console.log('📧 [EMAIL] Próba wysłania emaila...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [EMAIL] Email wysłany pomyślnie!');
    console.log('   Message ID:', info.messageId);
    console.log('   Odbiorca:', adminEmail);
    console.log('   Temat:', mailOptions.subject);
    return info;
  } catch (error) {
    console.error('❌ [EMAIL] BŁĄD podczas wysyłki email:');
    console.error('   Kod błędu:', error.code || 'BRAK');
    console.error('   Komunikat:', error.message || error);
    console.error('   Szczegóły:', JSON.stringify(error, null, 2));
    
    // Loguj szczegóły dla różnych typów błędów
    if (error.code === 'EAUTH') {
      console.error('   💡 Problem z autoryzacją - sprawdź SMTP_USER i SMTP_PASS');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('   💡 Problem z połączeniem - sprawdź SMTP_HOST i SMTP_PORT');
    } else if (error.response) {
      console.error('   Odpowiedź serwera:', error.response);
    }
    
    // Don't throw - email failure shouldn't fail the request
    // Return resolved promise (async functions return resolved promises by default)
    return;
  }
}

module.exports = {
  sendChecklistEmail
};


