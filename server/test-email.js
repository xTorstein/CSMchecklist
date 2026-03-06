require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Sprawdzanie konfiguracji email...\n');

// Sprawdź zmienne środowiskowe
console.log('📋 Konfiguracja:');
console.log(`  SMTP_HOST: ${process.env.SMTP_HOST || 'BRAK'}`);
console.log(`  SMTP_PORT: ${process.env.SMTP_PORT || 'BRAK'}`);
console.log(`  SMTP_USER: ${process.env.SMTP_USER || 'BRAK'}`);
console.log(`  SMTP_PASS: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-3) : 'BRAK'}`);
console.log(`  ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'BRAK'}`);
console.log('');

// Walidacja
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ BŁĄD: SMTP_USER lub SMTP_PASS nie są ustawione!');
  console.error('   Ustaw te zmienne w pliku server/.env');
  process.exit(1);
}

if (!process.env.ADMIN_EMAIL) {
  console.error('❌ BŁĄD: ADMIN_EMAIL nie jest ustawiony!');
  console.error('   Ustaw tę zmienną w pliku server/.env');
  process.exit(1);
}

// Sprawdź czy to nie są wartości demo
if (process.env.SMTP_USER === 'demo@example.com' || process.env.SMTP_PASS === 'dummy') {
  console.warn('⚠️  UWAGA: Wykryto wartości demo w konfiguracji!');
  console.warn('   Zmień SMTP_USER, SMTP_PASS i ADMIN_EMAIL na prawdziwe wartości w pliku server/.env');
  console.warn('');
}

// Utwórz transporter
console.log('🔧 Tworzenie połączenia SMTP...');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test połączenia
async function testConnection() {
  try {
    console.log('🔌 Testowanie połączenia z serwerem SMTP...');
    await transporter.verify();
    console.log('✅ Połączenie SMTP działa poprawnie!\n');
    
    // Test wysyłki emaila
    console.log('📧 Testowanie wysyłki emaila...');
    const testEmail = {
      from: `"CSM Checklist Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test konfiguracji email - CSM Checklist',
      text: 'To jest testowa wiadomość email. Jeśli otrzymałeś tę wiadomość, konfiguracja email działa poprawnie!',
      html: `
        <h2>Test konfiguracji email</h2>
        <p>To jest testowa wiadomość email.</p>
        <p>Jeśli otrzymałeś tę wiadomość, konfiguracja email działa poprawnie! ✅</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Wiadomość wygenerowana automatycznie przez system CSM Checklist</p>
      `
    };
    
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Email testowy został wysłany pomyślnie!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Odbiorca: ${process.env.ADMIN_EMAIL}`);
    console.log('\n🎉 Konfiguracja email jest poprawna!');
    
  } catch (error) {
    console.error('\n❌ BŁĄD podczas testowania email:');
    console.error(`   ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Wskazówki:');
      console.error('   - Sprawdź czy SMTP_USER i SMTP_PASS są poprawne');
      console.error('   - Dla Gmail: użyj hasła aplikacji, nie zwykłego hasła');
      console.error('   - Wygeneruj hasło aplikacji: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('\n💡 Wskazówki:');
      console.error('   - Sprawdź czy SMTP_HOST i SMTP_PORT są poprawne');
      console.error('   - Sprawdź połączenie internetowe');
      console.error('   - Sprawdź czy firewall nie blokuje połączenia');
    } else if (error.code === 'EENVELOPE') {
      console.error('\n💡 Wskazówki:');
      console.error('   - Sprawdź czy ADMIN_EMAIL jest poprawnym adresem email');
    }
    
    process.exit(1);
  }
}

testConnection();
