// Test API endpoints with authentication
const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('🧪 Teste API mit Authentication...\n');
    
    // Step 1: Try to authenticate
    console.log('1️⃣ Teste Authentication...');
    try {
      const authResponse = await axios.post(`${baseURL}/api/auth/login`, {
        email: 'test.debug@example.com',
        password: 'testpassword'
      });
      
      const token = authResponse.data.token;
      console.log('✅ Authentication successful');
      
      // Step 2: Test stage-specific endpoints
      const stageId = '3bfbd4a1-9d70-4a17-9b27-6fb22e241c1e';
      const headers = { Authorization: `Bearer ${token}` };
      
      console.log(`\n2️⃣ Teste Initiationsriten mit stageId=${stageId}...`);
      try {
        const initResponse = await axios.get(`${baseURL}/api/initiationsriten?stageId=${stageId}`, { headers });
        console.log(`✅ Initiationsriten: ${initResponse.data.data.length} gefunden`);
      } catch (error) {
        console.log(`❌ Initiationsriten Fehler: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }
      
      console.log(`\n3️⃣ Teste Privilegien mit stageId=${stageId}...`);
      try {
        const privResponse = await axios.get(`${baseURL}/api/privilegien?stageId=${stageId}`, { headers });
        console.log(`✅ Privilegien: ${privResponse.data.data.length} gefunden`);
      } catch (error) {
        console.log(`❌ Privilegien Fehler: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }
      
      console.log(`\n4️⃣ Teste Strafen mit stageId=${stageId}...`);
      try {
        const strafenResponse = await axios.get(`${baseURL}/api/strafen?stageId=${stageId}`, { headers });
        console.log(`✅ Strafen: ${strafenResponse.data.data.length} gefunden`);
      } catch (error) {
        console.log(`❌ Strafen Fehler: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }
      
      console.log(`\n5️⃣ Teste TPE mit stageId=${stageId}...`);
      try {
        const tpeResponse = await axios.get(`${baseURL}/api/tpe?stageId=${stageId}`, { headers });
        console.log(`✅ TPE: ${tpeResponse.data.data.length} gefunden`);
      } catch (error) {
        console.log(`❌ TPE Fehler: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }
      
    } catch (authError) {
      console.log(`❌ Authentication fehlgeschlagen: ${authError.response?.status} - ${authError.response?.data?.error || authError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Allgemeiner Test-Fehler:', error.message);
  }
}

testAPI();
