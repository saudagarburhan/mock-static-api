// netlify/functions/trigger-api.js
const https = require('https');

export const handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 1. Handle browser preflight prechecks
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const incomingData = JSON.parse(event.body);
    const { name, email, message } = incomingData;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // 2. Prepare URL-encoded form body parameters
    const formPayload = new URLSearchParams({
      'form-name': 'api-notification', 
      'bot-field': '',                  
      'name': name,
      'email': email,
      'message': message,
    }).toString();

    // 3. Extract your current domain information
    const host = event.headers.host || 'dashing-crumble-45a9de.netlify.app';

    // 4. Send the request natively to the Netlify Forms server core
    const forwardToNetlifyForms = () => {
      return new Promise((resolve, reject) => {
        const options = {
          hostname: host,
          port: 443,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(formPayload)
          }
        };

        const req = https.request(options, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve();
          } else {
            reject(new Error(`Netlify form accepted status: ${res.statusCode}`));
          }
        });

        req.on('error', (e) => reject(e));
        req.write(formPayload);
        req.end();
      });
    };

    await forwardToNetlifyForms();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ message: 'Notification queued successfully!' }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ error: error.message }),
    };
  }
};