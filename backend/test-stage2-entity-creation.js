// Test entity creation for Stage 2
const axios = require('axios');

async function testStage2EntityCreation() {
  console.log('🔍 Testing entity creation for Stage 2...\n');
  
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
    
    // Stage 2 ID from previous test
    const stage2Id = '684c1474-e61c-4293-bf8f-9582d6b7b43d';
    console.log(`📍 Using Stage 2 ID: ${stage2Id}`);
    
    // 2. Test Task creation for Stage 2
    console.log('\n2️⃣ Creating Task for Stage 2...');
    const taskData = {
      title: 'Test Task for Stage 2',
      description: 'Testing task creation for stage 2',
      category: 'ROUTINE',
      priority: 'MEDIUM',
      pointsReward: 15,
      stageId: stage2Id  // Stage 2 ID
    };
    
    console.log('📤 Sending task data:', JSON.stringify(taskData, null, 2));
    
    const taskResponse = await axios.post('http://localhost:3000/api/tasks', taskData, {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Task for Stage 2 created successfully!');
    console.log('📝 Created task:', JSON.stringify(taskResponse.data.data, null, 2));
    
    // 3. Test Strafe creation for Stage 2
    console.log('\n3️⃣ Creating Strafe for Stage 2...');
    const strafenData = {
      title: 'Test Strafe for Stage 2',
      description: 'Testing strafe creation for stage 2',
      reason: 'Testing stage 2 isolation',
      severity: 'MEDIUM',
      category: 'BEHAVIOR',
      userId: '05349c9f-867f-4609-8702-0ee9c642c658',
      stageId: stage2Id  // Stage 2 ID
    };
    
    console.log('📤 Sending strafe data:', JSON.stringify(strafenData, null, 2));
    
    const strafenResponse = await axios.post('http://localhost:3000/api/strafen', strafenData, {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Strafe for Stage 2 created successfully!');
    console.log('📝 Created strafe:', JSON.stringify(strafenResponse.data.data, null, 2));
    
    console.log('\n🎉 SUCCESS: Entity creation for Stage 2 is working correctly!');
    console.log('✨ Both Task and Strafe creation work for Stage 2');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.error || error.message);
    console.log('📊 Status:', error.response?.status);
    if (error.response?.data) {
      console.log('📄 Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testStage2EntityCreation();