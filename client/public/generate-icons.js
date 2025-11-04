const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // White text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.15}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CSM', size / 2, size / 2 - size * 0.1);
  ctx.font = `bold ${size * 0.1}px Arial`;
  ctx.fillText('Checklist', size / 2, size / 2 + size * 0.05);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`✅ Created ${filename} (${size}x${size})`);
}

// Create icons
createIcon(192, 'icon-192.png');
createIcon(512, 'icon-512.png');

console.log('\n🎉 Ikony PWA zostały wygenerowane!');

