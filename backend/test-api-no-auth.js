// Test API endpoints without authentication (direct endpoint test)
const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('🧪 Teste API Endpoints direkt...\n');
    
    const stageId = '3bfbd4a1-9d70-4a17-9b27-6fb22e241c1e';
    
    console.log(`1️⃣ Teste Health Endpoint...`);
    try {
      const healthResponse = await axios.get(`${baseURL}/health`);
      console.log(`✅ Health: ${healthResponse.data.status}`);
    } catch (error) {
      console.log(`❌ Health Fehler: ${error.response?.status} - ${error.message}`);
    }
    
    // These will fail due to auth, but we'll see what errors we get
    console.log(`\n2️⃣ Teste Initiationsriten ohne Auth (erwarten 401)...`);
    try {
      const initResponse = await axios.get(`${baseURL}/api/initiationsriten?stageId=${stageId}`);
      console.log(`✅ Initiationsriten: ${initResponse.data.data.length} gefunden`);
    } catch (error) {
      console.log(`❌ Initiationsriten Fehler: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    }
    
    console.log(`\n3️⃣ Teste Stages Endpoint ohne Auth...`);
    try {
      const stagesResponse = await axios.get(`${baseURL}/api/stages`);
      console.log(`✅ Stages: ${stagesResponse.data.length} gefunden`);
    } catch (error) {
      console.log(`❌ Stages Fehler: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Allgemeiner Test-Fehler:', error.message);
  }
}

testAPI();
