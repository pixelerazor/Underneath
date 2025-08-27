// Test strafen creation with stageId parameter
const axios = require('axios');

async function testStrafenCreationWithStageId() {
  console.log('🔍 Testing strafen creation with stageId parameter...\n');
  
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
    
    // 2. Get stages to find a stage ID
    console.log('\n2️⃣ Getting stages...');
    const stagesResponse = await axios.get('http://localhost:3000/api/stages', {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const stages = stagesResponse.data.data;
    console.log(`✅ Found ${stages.length} stages`);
    
    if (stages.length === 0) {
      throw new Error('No stages found for testing');
    }
    
    const firstStage = stages[0];
    console.log(`📍 Using stage: "${firstStage.name}" (ID: ${firstStage.id})`);
    
    // 3. Create strafe with stageId
    console.log('\n3️⃣ Creating strafe with stageId...');
    const strafenData = {
      title: 'Test Strafe with Stage ID',
      description: 'This is a test strafe to verify stageId parameter works',
      reason: 'Testing stage isolation',
      severity: 'MEDIUM',
      category: 'BEHAVIOR',
      userId: '05349c9f-867f-4609-8702-0ee9c642c658', // Use a valid user ID
      stageId: firstStage.id  // Include the stageId
    };
    
    console.log('📤 Sending strafe data:', JSON.stringify(strafenData, null, 2));
    
    const strafenResponse = await axios.post('http://localhost:3000/api/strafen', strafenData, {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Strafe created successfully!');
    console.log('📝 Created strafe:', JSON.stringify(strafenResponse.data.data, null, 2));
    
    console.log('\n🎉 SUCCESS: Strafen creation with stageId parameter is working correctly!');
    console.log('✨ All entity creation forms should now work without "stageId required" errors');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.error || error.message);
    console.log('📊 Status:', error.response?.status);
    if (error.response?.data) {
      console.log('📄 Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testStrafenCreationWithStageId();