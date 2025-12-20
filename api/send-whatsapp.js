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

        console.log('=== BotBiz WhatsApp API ===');
        console.log('Phone:', phone);

        // BotBiz API Key
        const BOTBIZ_API_KEY = '16072|FVaURdAB4Z07Py9V0HNBEkMHRpKY9zX9XWVitfHc123452c1';

        // Try the simple send endpoint first
        const simpleUrl = 'https://dash.botbiz.io/api/v1/whatsapp/send';

        const simplePayload = {
            phone: phone,
            message: message
        };

        console.log('Trying simple send endpoint...');
        console.log('URL:', simpleUrl);
        console.log('Payload:', JSON.stringify(simplePayload, null, 2));

        let apiResponse = await fetch(simpleUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BOTBIZ_API_KEY}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(simplePayload)
        });

        console.log('Simple endpoint response status:', apiResponse.status);

        // If simple endpoint fails, try template endpoint
        if (!apiResponse.ok && apiResponse.status !== 200) {
            console.log('Simple endpoint failed, trying template endpoint...');

            const templateUrl = 'https://dash.botbiz.io/api/v1/whatsapp/send/template';
            const templatePayload = {
                phone: phone,
                message: message,
                template_name: 'app_download',
                language: 'en'
            };

            console.log('Template URL:', templateUrl);
            console.log('Template Payload:', JSON.stringify(templatePayload, null, 2));

            apiResponse = await fetch(templateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BOTBIZ_API_KEY}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(templatePayload)
            });

            console.log('Template endpoint response status:', apiResponse.status);
        }

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
            console.log('Full Response:', JSON.stringify(apiData, null, 2));
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            apiData = { error: 'Could not parse response' };
        }

        // Check if successful - Look for success indicators in the response data
        const isSuccess = (apiResponse.ok || apiResponse.status === 200 || apiResponse.status === 201) &&
            (!apiData?.error && !apiData?.errors && apiData?.success !== false);

        console.log('=== Response Analysis ===');
        console.log('HTTP Status:', apiResponse.status);
        console.log('Response OK:', apiResponse.ok);
        console.log('Has Error in Data:', !!apiData?.error || !!apiData?.errors);
        console.log('Success Flag:', apiData?.success);
        console.log('Is Success:', isSuccess);
        console.log('========================');

        if (isSuccess) {
            console.log('✓ WhatsApp message sent successfully!');
            return res.status(200).json({
                success: true,
                message: 'WhatsApp message sent successfully',
                data: apiData
            });
        } else {
            console.error('✗ Both endpoints failed');
            console.error('Final Status:', apiResponse.status);
            console.error('Final Response:', JSON.stringify(apiData, null, 2));

            return res.status(500).json({
                success: false,
                error: 'Failed to send WhatsApp message',
                details: apiData?.message || apiData?.error || apiData?.errors || apiData?.rawResponse || `HTTP ${apiResponse.status}`,
                status: apiResponse.status,
                fullResponse: apiData,
                suggestion: 'Please check BotBiz dashboard for API documentation or contact BotBiz support'
            });
        }

    } catch (error) {
        console.error('=== Fatal Error ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);

        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message,
            suggestion: 'Please check server logs or contact administrator'
        });
    }
}
