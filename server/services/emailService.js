const nodemailer = require('nodemailer');
let Resend;
try {
  Resend = require('resend').Resend;
} catch (_) {
  Resend = null;
}

function useResend() {
  return !!(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);
}

function getResendFrom() {
  return process.env.RESEND_FROM_EMAIL || 'CSM Checklist <onboarding@resend.dev>';
}

// Validate SMTP configuration
function validateSMTPConfig() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return false;
  if (!process.env.ADMIN_EMAIL) return false;
  return true;
}

const DEFAULT_SMTP_PORT = 465;

function createTransporter(overrides = {}) {
  if (!validateSMTPConfig()) return null;
  try {
    const port = parseInt(process.env.SMTP_PORT, 10);
    const smtpPort = overrides.port ?? ((port && !isNaN(port)) ? port : DEFAULT_SMTP_PORT);
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const isSecurePort = smtpPort === 465;
    const options = {
      host,
      port: smtpPort,
      secure: isSecurePort,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 15000,
      greetingTimeout: 10000
    };
    if (!isSecurePort) options.requireTLS = true;
    return nodemailer.createTransport(options);
  } catch (error) {
    console.error('Error creating transporter:', error.message);
    return null;
  }
}

function buildChecklistEmailContent({ lecturerName, lecturerEmail, subjectName, dateNeeded, items, additionalNotes, checklistId }) {
  const itemsList = items.map((item, index) => {
    const quantity = item.quantity ? ` (${item.quantity})` : '';
    return `${index + 1}. ${item.name}${quantity}`;
  }).join('\n');
  const text = `
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
  const html = `
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
  `.trim();
  const subject = `Nowa checklista - ${subjectName} (${dateNeeded})`;
  return { text, html, subject };
}

async function sendChecklistEmailViaResend(payload) {
  if (!Resend || !useResend()) return null;
  const adminEmail = process.env.ADMIN_EMAIL;
  const { text, html, subject } = buildChecklistEmailContent(payload);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: getResendFrom(),
    to: [adminEmail],
    subject,
    text,
    html
  });
  if (error) {
    const msg = error.message || error;
    console.error('❌ [EMAIL] Resend error:', msg);
    if (error.name === 'validation_error' || String(msg).includes('own email address')) {
      console.error('   💡 Ustaw ADMIN_EMAIL na adres konta Resend albo zweryfikuj domenę (resend.com/domains) i ustaw RESEND_FROM_EMAIL.');
    }
    return undefined;
  }
  console.log('✅ [EMAIL] Email wysłany przez Resend. ID:', data?.id);
  return { messageId: data?.id };
}

async function sendChecklistEmailViaSMTP(payload) {
  const { lecturerName, lecturerEmail, subjectName, dateNeeded, items, additionalNotes, checklistId } = payload;
  const adminEmail = process.env.ADMIN_EMAIL;
  const smtpUser = process.env.SMTP_USER;
  const { text, html, subject } = buildChecklistEmailContent(payload);
  const transporter = createTransporter();
  if (!transporter) {
    console.error('❌ [EMAIL] SMTP not configured.');
    return undefined;
  }
  const mailOptions = {
    from: `"CSM Checklist" <${smtpUser}>`,
    to: adminEmail,
    subject,
    text,
    html
  };
  const currentPort = parseInt(process.env.SMTP_PORT, 10) || DEFAULT_SMTP_PORT;
  const isConnectionError = (e) => e && (e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT' || e.code === 'ECONNECTION');
  const trySend = (trans) => trans.sendMail(mailOptions);
  let lastError = null;
  try {
    const info = await trySend(transporter);
    console.log('✅ [EMAIL] Email wysłany (SMTP). Message ID:', info.messageId);
    return info;
  } catch (err) {
    lastError = err;
    if (isConnectionError(err) && (currentPort === 587 || currentPort === 465)) {
      const altPort = currentPort === 587 ? 465 : 587;
      console.warn('⚠️ [EMAIL] Błąd połączenia na porcie', currentPort, '- próba', altPort);
      const altTransporter = createTransporter({ port: altPort });
      if (altTransporter) {
        try {
          const info = await trySend(altTransporter);
          console.log('✅ [EMAIL] Email wysłany (port ' + altPort + ').');
          return info;
        } catch (err2) {
          lastError = err2;
        }
      }
    }
  }
  if (lastError) {
    console.error('❌ [EMAIL] SMTP błąd:', lastError.code || 'BRAK', lastError.message);
  }
  return undefined;
}

async function sendChecklistEmail(payload) {
  const { items, checklistId } = payload;
  console.log('📧 [EMAIL] Wysyłka checklisty ID:', checklistId);

  if (!process.env.ADMIN_EMAIL) {
    console.error('❌ [EMAIL] ADMIN_EMAIL nie ustawiony.');
    return undefined;
  }
  if (!items || !Array.isArray(items)) {
    console.error('❌ [EMAIL] Nieprawidłowe items.');
    return undefined;
  }

  if (useResend()) {
    const result = await sendChecklistEmailViaResend(payload);
    if (result) return result;
    console.warn('⚠️ [EMAIL] Resend nie wysłał – brak fallbacku SMTP przy włączonym Resend.');
    return undefined;
  }

  if (validateSMTPConfig()) {
    return await sendChecklistEmailViaSMTP(payload);
  }

  console.error('❌ [EMAIL] Brak konfiguracji: ustaw RESEND_API_KEY + ADMIN_EMAIL albo SMTP_* + ADMIN_EMAIL.');
  return undefined;
}

function isEmailConfigured() {
  return useResend() || !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_EMAIL);
}

async function sendTestEmail() {
  if (!process.env.ADMIN_EMAIL) {
    return { ok: false, error: 'ADMIN_EMAIL nie ustawiony.' };
  }

  if (useResend()) {
    if (!Resend) return { ok: false, error: 'Brak pakietu resend.' };
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: getResendFrom(),
      to: [process.env.ADMIN_EMAIL],
      subject: 'CSM Checklist – test',
      text: 'Test konfiguracji. Jeśli to widzisz, Resend działa.'
    });
    if (error) {
      const msg = error.message || String(error);
      const hint = (error.name === 'validation_error' || msg.includes('own email address'))
        ? 'Bez zweryfikowanej domeny Resend pozwala wysyłać tylko na adres Twojego konta Resend. Ustaw ADMIN_EMAIL na ten adres (np. ten, którym się rejestrowałeś w Resend) albo zweryfikuj domenę na resend.com/domains i ustaw RESEND_FROM_EMAIL.'
        : undefined;
      return { ok: false, error: msg, code: error.name, hint };
    }
    return { ok: true, message: 'Test email wysłany (Resend) do ' + process.env.ADMIN_EMAIL };
  }

  if (!validateSMTPConfig()) {
    return { ok: false, error: 'Ustaw RESEND_API_KEY + ADMIN_EMAIL (zalecane na Renderze) albo SMTP_USER, SMTP_PASS, ADMIN_EMAIL.' };
  }

  const mailOpts = {
    from: `"CSM Checklist" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'CSM Checklist – test SMTP',
    text: 'Test konfiguracji. Jeśli to widzisz, SMTP działa.'
  };
  const currentPort = parseInt(process.env.SMTP_PORT, 10) || DEFAULT_SMTP_PORT;
  const altPort = currentPort === 465 ? 587 : 465;
  const isConnectionError = (e) => e && (e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT' || e.code === 'ECONNECTION');

  for (const port of [currentPort, altPort]) {
    const transporter = createTransporter({ port });
    if (!transporter) continue;
    try {
      await transporter.sendMail(mailOpts);
      return { ok: true, message: 'Test email wysłany (SMTP port ' + port + ')' };
    } catch (err) {
      if (!isConnectionError(err)) {
        return {
          ok: false,
          error: err.message || String(err),
          code: err.code,
          hint: err.code === 'EAUTH' ? 'Użyj hasła aplikacji Gmail.' : undefined
        };
      }
      if (port === altPort) {
        return {
          ok: false,
          error: err.message || String(err),
          code: err.code,
          hint: 'Na Renderze Gmail SMTP często nie działa. Użyj Resend: w Environment dodaj RESEND_API_KEY (z resend.com) i ADMIN_EMAIL, zapisz i zrób deploy.'
        };
      }
    }
  }
  return {
    ok: false,
    error: 'Połączenie SMTP nieudane.',
    hint: 'Na Renderze użyj Resend: RESEND_API_KEY + ADMIN_EMAIL w Environment. Zob. RENDER-EMAIL-SETUP.md'
  };
}

module.exports = {
  sendChecklistEmail,
  isEmailConfigured,
  sendTestEmail
};
