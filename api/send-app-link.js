export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { countryCode, mobileNumber } = req.body;

    if (!mobileNumber || mobileNumber.length < 10) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }

    const fullNumber = countryCode + mobileNumber;
    const appLink = 'https://play.google.com/store/apps/details?id=com.ace2examzapp.android&hl=en_IN';

    // Call your Render backend
    const backendUrl = process.env.BACKEND_URL || 'https://chemistry-coaching.onrender.com';
    
    const response = await fetch(`${backendUrl}/api/send-app-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countryCode,
        mobileNumber
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'App link will be sent to your mobile number shortly',
        phone: fullNumber
      });
    } else {
      return res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Failed to send link. Please try again.',
      error: error.message
    });
  }
}
