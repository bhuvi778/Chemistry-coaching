// Test BotBiz API directly
const BOTBIZ_API_KEY = '16122|Ot9YpB7Zp4v0U9i9MI7A9ns4HYo6BtTy2zij0tTD41fabf26';
const PHONE_NUMBER_ID = '884991348021443';
const TEST_PHONE = '917017531067';
const TEST_MESSAGE = 'Test message from API';

const apiUrl = new URL('https://dash.botbiz.io/api/v1/whatsapp/send');
apiUrl.searchParams.append('apiToken', BOTBIZ_API_KEY);
apiUrl.searchParams.append('phone_number_id', PHONE_NUMBER_ID);
apiUrl.searchParams.append('phone_number', TEST_PHONE);
apiUrl.searchParams.append('message', TEST_MESSAGE);

console.log('Testing BotBiz API...');
console.log('URL:', apiUrl.toString());

fetch(apiUrl.toString(), {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        console.log('Response:', JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error('Error:', error);
    });
