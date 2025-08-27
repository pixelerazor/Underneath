// Check if created entities exist in database
const axios = require('axios');

async function checkCreatedEntities() {
  console.log('🔍 Checking created entities in database...\n');
  
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
    
    // Stage 2 ID
    const stage2Id = '684c1474-e61c-4293-bf8f-9582d6b7b43d';
    console.log(`📍 Using Stage 2 ID: ${stage2Id}`);
    
    // 2. Check rules for Stage 2 (which we just created)
    console.log('\n2️⃣ Checking rules for Stage 2...');
    const rulesResponse = await axios.get(`http://localhost:3000/api/rules?stageId=${stage2Id}`, {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Found ${rulesResponse.data.data.length} rules for Stage 2`);
    rulesResponse.data.data.forEach((rule, index) => {
      console.log(`   ${index + 1}. "${rule.title}" (ID: ${rule.id})`);
      console.log(`      StageId: ${rule.stageId}`);
      console.log(`      Created: ${rule.createdAt}`);
    });
    
    // 3. Check all rules WITHOUT stageId filter
    console.log('\n3️⃣ Checking all rules (no stage filter)...');
    const allRulesResponse = await axios.get('http://localhost:3000/api/rules', {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Found ${allRulesResponse.data.data.length} total rules`);
    allRulesResponse.data.data.forEach((rule, index) => {
      console.log(`   ${index + 1}. "${rule.title}" (Stage: ${rule.stageId})`);
    });
    
    // 4. Check tasks for Stage 2 (which we created earlier)
    console.log('\n4️⃣ Checking tasks for Stage 2...');
    const tasksResponse = await axios.get(`http://localhost:3000/api/tasks?stageId=${stage2Id}`, {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Found ${tasksResponse.data.data.length} tasks for Stage 2`);
    tasksResponse.data.data.forEach((task, index) => {
      console.log(`   ${index + 1}. "${task.title}" (ID: ${task.id})`);
      console.log(`      StageId: ${task.stageId}`);
      console.log(`      Created: ${task.createdAt}`);
    });
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.error || error.message);
    console.log('📊 Status:', error.response?.status);
    if (error.response?.data) {
      console.log('📄 Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkCreatedEntities();