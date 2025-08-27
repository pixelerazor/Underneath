// Debug Stages API Response
const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function debugStages() {
  try {
    // Login
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    });
    
    const authToken = loginResponse.data.accessToken;
    const headers = { Authorization: `Bearer ${authToken}` };
    
    console.log('🔍 Debug /api/stages Response...\n');
    
    const response = await axios.get(`${baseURL}/api/stages`, { headers });
    
    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data is array:', Array.isArray(response.data));
    console.log('Response data keys:', Object.keys(response.data || {}));
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    }
  }
}

debugStages();
