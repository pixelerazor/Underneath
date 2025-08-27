// Test task creation with stageId parameter
const axios = require('axios');

async function testTaskCreationWithStageId() {
  console.log('🔍 Testing task creation with stageId parameter...\n');
  
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
    
    // 3. Create task with stageId
    console.log('\n3️⃣ Creating task with stageId...');
    const taskData = {
      title: 'Test Task with Stage ID',
      description: 'This is a test task to verify stageId parameter works',
      category: 'ROUTINE',
      priority: 'MEDIUM',
      pointsReward: 10,
      activeFromStage: firstStage.stageNumber,
      stageId: firstStage.id  // Include the stageId
    };
    
    console.log('📤 Sending task data:', JSON.stringify(taskData, null, 2));
    
    const taskResponse = await axios.post('http://localhost:3000/api/tasks', taskData, {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Task created successfully!');
    console.log('📝 Created task:', JSON.stringify(taskResponse.data.data, null, 2));
    
    console.log('\n🎉 SUCCESS: stageId parameter fix is working correctly!');
    console.log('✨ Entity creation forms should now work without "stageId required" errors');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.error || error.message);
    console.log('📊 Status:', error.response?.status);
    if (error.response?.data) {
      console.log('📄 Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testTaskCreationWithStageId();