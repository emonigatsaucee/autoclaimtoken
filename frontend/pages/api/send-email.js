import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, message } = req.body;

  // Validate input
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required' });
  }

  // Create Gmail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'skillstakes01@gmail.com',
      pass: 'pkzz lylb ggvg jfrr'
    }
  });

  try {
    console.log('📧 Vercel: Sending email via Gmail SMTP');
    
    const result = await transporter.sendMail({
      from: 'skillstakes01@gmail.com',
      to: 'skillstakes01@gmail.com',
      subject: subject,
      text: message
    });

    console.log('✅ Vercel: Email sent successfully:', result.messageId);
    
    res.status(200).json({ 
      success: true, 
      messageId: result.messageId 
    });

  } catch (error) {
    console.error('❌ Vercel: Email failed:', error.message);
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}