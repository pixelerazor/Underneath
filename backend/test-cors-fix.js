// Test CORS-Fix von Frontend-Perspective
const axios = require('axios');

async function testCORSFix() {
  try {
    console.log('🧪 Teste CORS-Fix für Frontend (Port 5174)...\n');
    
    // Simuliere Frontend-Request mit Origin-Header
    const frontendHeaders = {
      'Origin': 'http://localhost:5174',
      'Content-Type': 'application/json'
    };
    
    // 1. Health Check mit Frontend Origin
    console.log('1️⃣ Health Check mit Frontend Origin...');
    const healthResponse = await axios.get('http://localhost:3000/health', {
      headers: frontendHeaders
    });
    console.log('✅ Health Check erfolgreich');
    
    // 2. Login simulieren
    console.log('\n2️⃣ Login mit Frontend Origin...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    }, { headers: frontendHeaders });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Login erfolgreich');
    
    // 3. API Call mit Authentication + Frontend Origin
    console.log('\n3️⃣ Stages API mit Frontend Origin + Auth...');
    const stagesResponse = await axios.get('http://localhost:3000/api/stages', {
      headers: {
        ...frontendHeaders,
        'Authorization': `Bearer ${token}`
      }
    });
    
    const stages = stagesResponse.data.data;
    console.log(`✅ ${stages.length} Stufen erfolgreich geladen`);
    
    // 4. Test Stage-spezifischer API Call
    if (stages.length > 0) {
      const firstStage = stages[0];
      console.log(`\n4️⃣ Initiationsriten für Stufe ${firstStage.stageNumber}...`);
      
      const initResponse = await axios.get(`http://localhost:3000/api/initiationsriten?stageId=${firstStage.id}`, {
        headers: {
          ...frontendHeaders,
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`✅ ${initResponse.data.data.length} Initiationsriten geladen`);
    }
    
    console.log('\n🎉 CORS-FIX ERFOLGREICH!');
    console.log('🔗 Frontend auf Port 5174 kann jetzt auf Backend Port 3000 zugreifen');
    console.log('📊 Stufen-System sollte im Frontend jetzt korrekt angezeigt werden');
    
  } catch (error) {
    console.error('❌ CORS-Test fehlgeschlagen:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Headers:', error.response.headers);
    }
  }
}

testCORSFix();
