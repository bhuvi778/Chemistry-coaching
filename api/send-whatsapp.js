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

        console.log('=== BotBiz WhatsApp Template API ===');
        console.log('Phone:', phone);
        console.log('Message:', message);

        // BotBiz Template API endpoint
        const apiUrl = 'https://dash.botbiz.io/api/v1/whatsapp/send/template';

        // API Key
        const BOTBIZ_API_KEY = '16072|FVaURdAB4Z07Py9V0HNBEkMHRpKY9zX9XWVitfHc123452c1';

        // Template payload format
        const payload = {
            phone: phone,
            message: message,
            template_name: 'app_download', // You may need to adjust this
            language: 'en',
            parameters: [
                {
                    type: 'text',
                    text: message
                }
            ]
        };

        console.log('Sending to BotBiz API...');
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BOTBIZ_API_KEY}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Response status:', apiResponse.status);

        // Get response data
        let apiData;
        const contentType = apiResponse.headers.get('content-type');

        try {
            if (contentType && contentType.includes('application/json')) {
                apiData = await apiResponse.json();
            } else {
                const textData = await apiResponse.text();
                apiData = { rawResponse: textData };
            }
            console.log('Response data:', JSON.stringify(apiData, null, 2));
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            apiData = { error: 'Could not parse response' };
        }

        // Check if successful
        if (apiResponse.ok || apiResponse.status === 200 || apiResponse.status === 201) {
            console.log('✓ WhatsApp message sent successfully');
            return res.status(200).json({
                success: true,
                message: 'WhatsApp message sent successfully',
                data: apiData
            });
        } else {
            console.error('✗ API request failed');
            console.error('Status:', apiResponse.status);
            console.error('Response:', apiData);

            return res.status(200).json({
                success: false,
                error: 'Failed to send WhatsApp message',
                details: apiData?.message || apiData?.error || apiData?.rawResponse || 'Unknown error',
                status: apiResponse.status,
                fullResponse: apiData
            });
        }

    } catch (error) {
        console.error('=== Error ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);

        return res.status(200).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
}
