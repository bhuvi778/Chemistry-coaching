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

        // BotBiz API Configuration
        const BOTBIZ_API_KEY = process.env.BOTBIZ_API_KEY || '16122|Ot9YpB7Zp4v0U9i9MI7A9ns4HYo6BtTy2zij0tTD41fabf26';
        const PHONE_NUMBER_ID = process.env.BOTBIZ_PHONE_NUMBER_ID || '884991348021443';

        console.log('API Key (first 10 chars):', BOTBIZ_API_KEY.substring(0, 10) + '...');
        console.log('Phone Number ID:', PHONE_NUMBER_ID);

        // Check if phone number ID is provided
        if (!PHONE_NUMBER_ID) {
            console.error('⚠ PHONE_NUMBER_ID not configured');
            return res.status(500).json({
                success: false,
                error: 'WhatsApp configuration incomplete',
                details: 'PHONE_NUMBER_ID is required. Please add it to environment variables.',
                suggestion: 'Add BOTBIZ_PHONE_NUMBER_ID to your Vercel environment variables'
            });
        }

        // Build the API URL with query parameters for TEMPLATE message
        console.log('=== Building API Request ===');
        console.log('Sending WhatsApp TEMPLATE message via BotBiz API...');

        // Use template endpoint (required by WhatsApp for new users)
        const TEMPLATE_NAME = process.env.BOTBIZ_TEMPLATE_NAME || 'app_download'; // Your template name

        const apiUrl = new URL('https://dash.botbiz.io/api/v1/whatsapp/send/template');
        apiUrl.searchParams.append('apiToken', BOTBIZ_API_KEY);
        apiUrl.searchParams.append('phone_number_id', PHONE_NUMBER_ID);
        apiUrl.searchParams.append('phone_number', phone);
        apiUrl.searchParams.append('template_name', TEMPLATE_NAME);
        apiUrl.searchParams.append('language', 'en');

        console.log('Full API URL:', apiUrl.toString());
        console.log('Parameters:');
        console.log('  - apiToken:', BOTBIZ_API_KEY.substring(0, 10) + '...');
        console.log('  - phone_number_id:', PHONE_NUMBER_ID);
        console.log('  - phone_number:', phone);
        console.log('  - template_name:', TEMPLATE_NAME);
        console.log('  - language: en');
        console.log('========================');

        // Make GET request to BotBiz Template API
        const apiResponse = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Ace2Examz-Website/1.0'
            }
        });

        console.log('API response status:', apiResponse.status);

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

        // Check if successful - BotBiz returns status: "1" for success, "0" for failure
        const isSuccess = (apiResponse.ok || apiResponse.status === 200 || apiResponse.status === 201) &&
            (apiData?.status === "1" || apiData?.status === 1) &&
            (!apiData?.error && !apiData?.errors);

        console.log('=== Response Analysis ===');
        console.log('HTTP Status:', apiResponse.status);
        console.log('Response OK:', apiResponse.ok);
        console.log('BotBiz Status:', apiData?.status);
        console.log('BotBiz Message:', apiData?.message);
        console.log('Has Error in Data:', !!apiData?.error || !!apiData?.errors);
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
            console.error('✗ API request failed');
            console.error('Final Status:', apiResponse.status);
            console.error('Final Response:', JSON.stringify(apiData, null, 2));

            return res.status(500).json({
                success: false,
                error: 'Failed to send WhatsApp message',
                details: apiData?.message || apiData?.error || apiData?.errors || apiData?.rawResponse || `HTTP ${apiResponse.status}`,
                status: apiResponse.status,
                fullResponse: apiData,
                suggestion: apiData?.message?.includes('24 hour')
                    ? 'WORKAROUND: First, send a WhatsApp message from your phone to +919115179935, then try again. OR create a Message Template in BotBiz dashboard (see WHATSAPP_TEMPLATE_SETUP.md).'
                    : 'Please check BotBiz dashboard for API documentation or verify your phone_number_id'
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
