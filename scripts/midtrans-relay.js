// Simple Express.js relay for Midtrans webhook
// Place this on your server at https://api.scalev.id/v2/webhooks/midtrans/payment-notification

const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Replace with your actual Vercel endpoint
const VERCEL_WEBHOOK_URL = 'https://eventoriaa.vercel.app/api/payment/webhook';

app.post('/v2/webhooks/midtrans/payment-notification', async (req, res) => {
  try {
    // Forward the payload to your Vercel webhook endpoint
    const response = await fetch(VERCEL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    // Respond to Midtrans with the same status
    res.status(200).json({ message: 'Forwarded to Vercel', vercelResponse: data });
  } catch (error) {
    console.error('Relay error:', error);
    res.status(500).json({ error: 'Failed to forward to Vercel', detail: error.message });
  }
});

// For GET test
app.get('/v2/webhooks/midtrans/payment-notification', (req, res) => {
  res.status(200).json({ message: 'Midtrans relay endpoint OK' });
});

// Start server (adjust port as needed)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Relay server listening on port ${PORT}`);
});
