// Simuliere exakt den Request, den das Frontend macht
const axios = require('axios');

async function debugFrontendRequest() {
  console.log('🔍 Simuliere exakt Frontend-Request...\n');
  
  try {
    // Prüfe zuerst, welche URL das Frontend wirklich verwendet
    const API_BASE_URL = 'http://localhost:3000'; // Was das Frontend verwenden sollte
    
    console.log('1️⃣ Test direkte API-URL:', `${API_BASE_URL}/api/stages`);
    
    // Simuliere Browser-Request mit allen typischen Headers
    const frontendHeaders = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Origin': 'http://localhost:5174',
      'Referer': 'http://localhost:5174/education/stufenplan',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
    
    console.log('2️⃣ Headers:', frontendHeaders);
    
    // Preflight-Request (OPTIONS) simulieren
    console.log('\n3️⃣ Teste OPTIONS Preflight...');
    try {
      const optionsResponse = await axios.options(`${API_BASE_URL}/api/stages`, {
        headers: frontendHeaders
      });
      console.log('✅ OPTIONS erfolgreich');
    } catch (error) {
      console.log('❌ OPTIONS fehlgeschlagen:', error.message);
    }
    
    // Dann echten GET-Request
    console.log('\n4️⃣ Teste GET Request...');
    const getResponse = await axios.get(`${API_BASE_URL}/api/stages`, {
      headers: frontendHeaders,
      timeout: 10000
    });
    
    console.log('✅ GET erfolgreich, Status:', getResponse.status);
    console.log('Response headers:', getResponse.headers);
    
  } catch (error) {
    console.log('❌ Frontend-Request fehlgeschlagen:');
    console.log('   Nachricht:', error.message);
    console.log('   Code:', error.code);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Response Headers:', error.response.headers);
    }
  }
}

debugFrontendRequest();
