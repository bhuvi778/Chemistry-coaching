// Vercel Serverless Function to send WhatsApp messages via BotBiz API
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

        // BotBiz API endpoint
        const apiUrl = 'https://dash.botbiz.io/api/v1/whatsapp/send';

        // You need to add your BotBiz API key here
        // Get it from your BotBiz dashboard
        const BOTBIZ_API_KEY = process.env.BOTBIZ_API_KEY || 'YOUR_API_KEY_HERE';

        const payload = {
            phone: phone,
            message: message,
            // Add other required fields based on BotBiz API documentation
        };

        console.log('Calling BotBiz API with payload:', payload);

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BOTBIZ_API_KEY}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('BotBiz API response status:', apiResponse.status);

        // Try to get response data
        let apiData;
        const contentType = apiResponse.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            apiData = await apiResponse.json();
            console.log('BotBiz API response data:', apiData);
        } else {
            const textData = await apiResponse.text();
            console.log('BotBiz API response (text):', textData);
            apiData = { message: textData };
        }

        // Check if successful
        if (apiResponse.ok || apiResponse.status === 200 || apiResponse.status === 201) {
            return res.status(200).json({
                success: true,
                message: 'WhatsApp message sent successfully',
                data: apiData
            });
        } else {
            console.error('BotBiz API error:', apiData);
            return res.status(apiResponse.status).json({
                success: false,
                error: 'API request failed',
                details: apiData?.message || apiData?.error || 'Failed to send message',
                status: apiResponse.status
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
