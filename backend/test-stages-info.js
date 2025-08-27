// Get all stages information
const axios = require('axios');

async function getAllStagesInfo() {
  console.log('🔍 Getting all stages information...\n');
  
  try {
    // 1. Login to get token
    console.log('1️⃣ Login...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    }, {
      headers: { 'Origin': 'http://localhost:5174' }
    });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Token erhalten');
    
    // 2. Get all stages
    console.log('\n2️⃣ Getting all stages...');
    const stagesResponse = await axios.get('http://localhost:3000/api/stages', {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const stages = stagesResponse.data.data;
    console.log(`✅ Found ${stages.length} stages:`);
    
    stages.forEach((stage, index) => {
      console.log(`\n${index + 1}. Stufe ${stage.stageNumber}: "${stage.name}"`);
      console.log(`   ID: ${stage.id}`);
      console.log(`   Beschreibung: ${stage.description || 'Keine Beschreibung'}`);
      console.log(`   Punkte erforderlich: ${stage.pointsRequired}`);
      console.log(`   Aktiv: ${stage.isActive}`);
      console.log(`   Farbe: ${stage.color || 'Keine Farbe'}`);
    });
    
    return stages;
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.error || error.message);
    return [];
  }
}

getAllStagesInfo();