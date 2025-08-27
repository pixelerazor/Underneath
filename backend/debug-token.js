// Debug JWT Token Issue
const axios = require('axios');
const jwt = require('jsonwebtoken');

const baseURL = 'http://localhost:3001';

async function debugToken() {
  try {
    console.log('🔍 Debug JWT Token Issue...\n');
    
    // Step 1: Login und Token erhalten
    console.log('1️⃣ Login...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    });
    
    const token = loginResponse.data.token || loginResponse.data.accessToken;
    console.log('✅ Token erhalten:', token ? 'Ja' : 'Nein');
    console.log('Token response keys:', Object.keys(loginResponse.data));
    
    if (token) {
      // Step 2: Token dekodieren (ohne Verifikation)
      console.log('\n2️⃣ Token dekodieren...');
      try {
        const decoded = jwt.decode(token);
        console.log('✅ Token dekodiert:', JSON.stringify(decoded, null, 2));
      } catch (e) {
        console.log('❌ Token dekodierung fehlgeschlagen:', e.message);
      }
      
      // Step 3: Test mit verschiedenen Header-Formaten
      console.log('\n3️⃣ Teste verschiedene Authorization Header...');
      
      const testConfigs = [
        { name: 'Bearer Token', headers: { Authorization: `Bearer ${token}` } },
        { name: 'Token ohne Bearer', headers: { Authorization: token } },
        { name: 'Lowercase bearer', headers: { authorization: `Bearer ${token}` } },
      ];
      
      for (const config of testConfigs) {
        try {
          const response = await axios.get(`${baseURL}/api/stages`, { headers: config.headers });
          console.log(`✅ ${config.name}: Erfolreich (${response.data.length} stages)`);
          break; // Bei Erfolg stoppen
        } catch (error) {
          console.log(`❌ ${config.name}: ${error.response?.status} - ${error.response?.data?.error}`);
        }
      }
      
      // Step 4: Test health endpoint
      console.log('\n4️⃣ Test Health Endpoint...');
      try {
        const healthResponse = await axios.get(`${baseURL}/health`);
        console.log('✅ Health endpoint funktioniert:', healthResponse.data);
      } catch (error) {
        console.log('❌ Health endpoint Fehler:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Debug fehlgeschlagen:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

debugToken();
