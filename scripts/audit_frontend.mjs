import http from 'http';

http.get('http://localhost:5173/', (res) => {
  console.log(`Frontend Web Client Status: ${res.statusCode} ${res.statusMessage}`);
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    const hasHtml = data.includes('<html') || data.includes('<!DOCTYPE html>');
    console.log(`Vite SPA Bundle Served Correctly: ${hasHtml ? '✅ YES' : '❌ NO'}`);
  });
}).on('error', (err) => {
  console.error('Frontend connection error:', err.message);
});
