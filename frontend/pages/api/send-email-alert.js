export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, subject, data } = req.body;

  try {
    // Multiple email notification methods
    const alerts = [];

    // Method 1: EmailJS (client-side service)
    alerts.push(sendEmailJS(subject, data));

    // Method 2: Webhook to email service
    alerts.push(sendWebhookAlert(subject, data));

    // Method 3: Telegram bot (if configured)
    alerts.push(sendTelegramAlert(subject, data));

    // Execute all alert methods
    await Promise.allSettled(alerts);

    res.status(200).json({
      success: true,
      message: 'Alert sent successfully'
    });

  } catch (error) {
    console.error('Email alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send alert'
    });
  }
}

async function sendEmailJS(subject, data) {
  try {
    // EmailJS configuration (free email service)
    const emailData = {
      service_id: 'service_crypto',
      template_id: 'template_alert',
      user_id: 'user_admin',
      template_params: {
        to_email: 'admin@cryptorecover.com', // Replace with admin email
        subject: subject,
        message: JSON.stringify(data, null, 2)
      }
    };

    // This would normally send via EmailJS API
    console.log('📧 EmailJS Alert:', emailData);
    return true;
  } catch (error) {
    console.log('EmailJS failed:', error);
    return false;
  }
}

async function sendWebhookAlert(subject, data) {
  try {
    // Webhook to email service (like Zapier, IFTTT, etc.)
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subject,
        data: data,
        timestamp: new Date().toISOString()
      })
    });

    console.log('🔗 Webhook Alert sent');
    return response.ok;
  } catch (error) {
    console.log('Webhook failed:', error);
    return false;
  }
}

async function sendTelegramAlert(subject, data) {
  try {
    // Telegram Bot API (replace with your bot token and chat ID)
    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';
    
    const message = `🚨 ${subject}\n\n${JSON.stringify(data, null, 2)}`;
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    console.log('📱 Telegram Alert sent');
    return response.ok;
  } catch (error) {
    console.log('Telegram failed:', error);
    return false;
  }
}