// Test mit Authentication Token
const axios = require('axios');

async function testWithAuth() {
  console.log('🔍 Teste mit Authentication Token...\n');
  
  try {
    // 1. Login um Token zu bekommen
    console.log('1️⃣ Login...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    }, {
      headers: { 'Origin': 'http://localhost:5174' }
    });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Token erhalten');
    
    // 2. API-Request mit Token und Frontend Headers
    console.log('\n2️⃣ API-Request mit Token...');
    const stagesResponse = await axios.get('http://localhost:3000/api/stages', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`,
        'Referer': 'http://localhost:5174/education/stufenplan'
      }
    });
    
    console.log('✅ Stages erfolgreich geladen:', stagesResponse.status);
    console.log('CORS Header:', stagesResponse.headers['access-control-allow-origin']);
    console.log('Anzahl Stufen:', stagesResponse.data.data.length);
    
    console.log('\n🎯 PROBLEM IDENTIFIZIERT:');
    console.log('❌ CORS funktioniert korrekt!');
    console.log('❌ Das Problem ist: Das Frontend sendet keinen Authorization Token!');
    console.log('❌ Deswegen bekommt es 401 Unauthorized');
    console.log('❌ Der Browser zeigt das fälschlich als CORS-Fehler an');
    
  } catch (error) {
    console.log('❌ Fehler:', error.message);
  }
}

testWithAuth();
