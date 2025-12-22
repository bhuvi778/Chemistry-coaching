// Vercel Serverless Function to send WhatsApp messages via BotBiz API
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { phone, name } = req.body;

        // Validate input
        if (!phone || !name) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Both phone and name are required'
            });
        }

        console.log('=== BotBiz WhatsApp Template API ===');
        console.log('Phone:', phone);
        console.log('Name:', name);

        // BotBiz API Configuration
        const BOTBIZ_API_KEY = process.env.BOTBIZ_API_KEY || '16122|Ot9YpB7Zp4v0U9i9MI7A9ns4HYo6BtTy2zij0tTD41fabf26';
        const PHONE_NUMBER_ID = process.env.BOTBIZ_PHONE_NUMBER_ID || '884991348021443';
        const TEMPLATE_ID = process.env.BOTBIZ_TEMPLATE_ID || '277083'; // Correct template ID
        const TEMPLATE_NAME = 'get_link'; // Correct template name

        console.log('API Key (first 10 chars):', BOTBIZ_API_KEY.substring(0, 10) + '...');
        console.log('Phone Number ID:', PHONE_NUMBER_ID);
        console.log('Template ID:', TEMPLATE_ID);

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

        // Build the API request for TEMPLATE message with variables
        console.log('=== Building API Request ===');
        console.log('Sending WhatsApp TEMPLATE message with variable...');

        const apiUrl = 'https://dash.botbiz.io/api/v1/whatsapp/send/template';

        // Build form data as shown in BotBiz POST example
        const formData = new URLSearchParams();
        formData.append('apiToken', BOTBIZ_API_KEY);
        formData.append('phone_number_id', PHONE_NUMBER_ID);
        formData.append('template_id', TEMPLATE_ID);
        formData.append('phone_number', phone);

        // Try body_variables format for template {{1}}, {{2}}
        const bodyVariables = [{ "text": name }];
        formData.append('body_variables', JSON.stringify(bodyVariables));

        console.log('API URL:', apiUrl);
        console.log('Sending variables:');
        console.log('  - template_id:', TEMPLATE_ID);
        console.log('  - phone_number:', phone);
        console.log('  - body_variables:', JSON.stringify(bodyVariables));
        console.log('========================');

        // Make POST request with form data (as shown in BotBiz curl example)
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: formData.toString()
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
