export const handler = async (event, context) => {
  // Define standard CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 1. Handle browser preflight OPTIONS requests immediately
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // 2. Only allow POST requests for processing data
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

    const protocol = event.headers['x-nf-request-protocol'] || 'https';
    const host = event.headers.host;
    const siteUrl = `${protocol}://${host}`;

    const formPayload = new URLSearchParams({
      'form-name': 'api-notification', 
      'bot-field': '',                  
      'name': name,
      'email': email,
      'message': message,
    });

    const netlifyResponse = await fetch(`${siteUrl}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formPayload.toString(),
    });

    if (!netlifyResponse.ok) {
      throw new Error('Failed to forward submission to Netlify Forms');
    }

    // 3. Return success with CORS headers attached
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
