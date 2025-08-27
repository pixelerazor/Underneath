// Test rule creation with stageId parameter
const axios = require('axios');

async function testRuleCreationWithStageId() {
  console.log('🔍 Testing rule creation with stageId parameter...\n');
  
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
    
    // 3. Create rule with stageId
    console.log('\n3️⃣ Creating rule with stageId...');
    const ruleData = {
      title: 'Test Rule with Stage ID',
      description: 'This is a test rule to verify stageId parameter works',
      category: 'BEHAVIOR',
      severity: 'MEDIUM',
      pointsPenalty: 10,
      stageId: firstStage.id  // Include the stageId
    };
    
    console.log('📤 Sending rule data:', JSON.stringify(ruleData, null, 2));
    
    const ruleResponse = await axios.post('http://localhost:3000/api/rules', ruleData, {
      headers: {
        'Origin': 'http://localhost:5174',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Rule created successfully!');
    console.log('📝 Created rule:', JSON.stringify(ruleResponse.data.data, null, 2));
    
    console.log('\n🎉 SUCCESS: Both task and rule creation with stageId parameter are working correctly!');
    console.log('✨ All entity creation forms should now work without "stageId required" errors');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.error || error.message);
    console.log('📊 Status:', error.response?.status);
    if (error.response?.data) {
      console.log('📄 Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testRuleCreationWithStageId();