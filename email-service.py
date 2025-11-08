#!/usr/bin/env python3
"""
Free Python Email Service for CryptoRecover
Deploy this on Railway, Heroku, or PythonAnywhere (all have free tiers)
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USER = os.environ.get('OWNER_EMAIL', 'skillstakes01@gmail.com')
EMAIL_PASS = os.environ.get('EMAIL_PASSWORD', 'pkzz lylb ggvg jfrr')

def send_email(to_email, subject, message):
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add body to email
        msg.attach(MIMEText(message, 'plain'))
        
        # Gmail SMTP configuration
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Enable security
        server.login(EMAIL_USER, EMAIL_PASS)
        
        # Send email
        text = msg.as_string()
        server.sendmail(EMAIL_USER, to_email, text)
        server.quit()
        
        return True, "Email sent successfully"
        
    except Exception as e:
        return False, str(e)

@app.route('/send-email', methods=['POST'])
def send_email_endpoint():
    try:
        data = request.json
        
        to_email = data.get('to', EMAIL_USER)
        subject = data.get('subject', 'CryptoRecover Alert')
        message = data.get('message', 'No message provided')
        
        success, result = send_email(to_email, subject, message)
        
        if success:
            return jsonify({
                'success': True,
                'message': result
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'CryptoRecover Email Service'
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)