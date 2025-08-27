const axios = require('axios');

async function debugAPIError() {
  try {
    console.log('🔍 Debug API-Fehler...\n');
    
    // Test 1: Get token
    console.log('1️⃣ Login...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'Testdom666@example.com',
      password: 'TestPassword123!'
    });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Token erhalten');
    
    // Test 2: Test problematic endpoint
    console.log('\n2️⃣ Teste Initiationsriten API...');
    
    try {
      const response = await axios.get('http://localhost:3000/api/initiationsriten?stageId=3bfbd4a1-9d70-4a17-9b27-6fb22e241c1e', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ API Aufruf erfolgreich');
      console.log('Daten:', response.data);
    } catch (apiError) {
      console.log('❌ API Fehler:');
      console.log('Status:', apiError.response?.status);
      console.log('Status Text:', apiError.response?.statusText);
      console.log('Error Data:', apiError.response?.data);
      console.log('Full Error:', apiError.message);
    }
    
    // Test 3: Test other endpoints
    console.log('\n3️⃣ Teste andere APIs...');
    
    const endpoints = [
      'privilegien',
      'strafen', 
      'tpe'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:3000/api/${endpoint}?stageId=3bfbd4a1-9d70-4a17-9b27-6fb22e241c1e`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`✅ ${endpoint}: ${response.data.data?.length || 0} Einträge`);
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status} - ${error.response?.statusText}`);
        if (error.response?.data) {
          console.log(`   Error: ${JSON.stringify(error.response.data)}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Allgemeiner Fehler:', error.message);
  }
}

debugAPIError();