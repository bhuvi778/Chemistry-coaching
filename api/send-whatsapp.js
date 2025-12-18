// Vercel Serverless Function to send WhatsApp messages via webhook
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { phone, message } = req.body;

        // Validate input
        if (!phone || !message) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Both phone and message are required'
            });
        }

        console.log('Sending WhatsApp to:', phone);

        // Call the webhook
        const webhookUrl = 'https://dash.botbiz.io/webhook/whatsapp-workflow/37938.234726.277083.1765173100';

        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                phoneNumber: phone,
                mobile: phone,
                to: phone,
                number: phone,
                message: message,
                text: message,
                body: message
            })
        });

        console.log('Webhook response status:', webhookResponse.status);

        // Try to get response data
        let webhookData;
        const contentType = webhookResponse.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            webhookData = await webhookResponse.json();
            console.log('Webhook response data:', webhookData);
        } else {
            const textData = await webhookResponse.text();
            console.log('Webhook response (text):', textData);
            webhookData = { message: textData };
        }

        // Check if successful
        if (webhookResponse.ok || webhookResponse.status === 200) {
            return res.status(200).json({
                success: true,
                message: 'WhatsApp message sent successfully',
                data: webhookData
            });
        } else {
            console.error('Webhook error:', webhookData);
            return res.status(webhookResponse.status).json({
                success: false,
                error: 'Webhook request failed',
                details: webhookData,
                status: webhookResponse.status
            });
        }

    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
}
