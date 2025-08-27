// Test Backend auf Port 3000
const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function testPort3000() {
  try {
    console.log('🚀 Teste Backend auf Port 3000...\n');
    
    // 1. Health Check
    console.log('1️⃣ Health Check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health:', healthResponse.data.status);
    
    // 2. Authentication
    console.log('\n2️⃣ Authentication Test...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    });
    
    const authToken = loginResponse.data.accessToken;
    const headers = { Authorization: `Bearer ${authToken}` };
    console.log('✅ Authentication erfolgreich');
    
    // 3. Stage System Test
    console.log('\n3️⃣ Stage System Test...');
    const stagesResponse = await axios.get(`${baseURL}/api/stages`, { headers });
    const stages = stagesResponse.data.data;
    
    console.log(`✅ ${stages.length} Stufen geladen`);
    
    let totalEntities = 0;
    stages.forEach(stage => {
      const stageTotal = Object.values(stage._count).reduce((sum, count) => sum + (count || 0), 0);
      totalEntities += stageTotal;
      if (stageTotal > 0) {
        console.log(`   Stufe ${stage.stageNumber}: ${stageTotal} Entitäten`);
      }
    });
    
    // 4. Test ersten Stufen-Endpoint
    if (stages.length > 0) {
      const firstStage = stages[0];
      console.log(`\n4️⃣ Teste Initiationsriten für Stufe ${firstStage.stageNumber}...`);
      const initResponse = await axios.get(`${baseURL}/api/initiationsriten?stageId=${firstStage.id}`, { headers });
      console.log(`✅ ${initResponse.data.data.length} Initiationsriten gefunden`);
    }
    
    console.log(`\n🎉 BACKEND AUF PORT 3000 FUNKTIONIERT PERFEKT!`);
    console.log(`📊 Gesamt: ${totalEntities} Entitäten im System`);
    console.log(`🔗 Das Frontend kann jetzt korrekt auf http://localhost:3000 zugreifen`);
    
  } catch (error) {
    console.error('❌ Fehler beim Testen von Port 3000:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testPort3000();
