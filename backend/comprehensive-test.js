// Umfassender Test des Stufensystems
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const prisma = new PrismaClient();
const baseURL = 'http://localhost:3001';

let authToken = null;

async function createTestUser() {
  try {
    console.log('🔧 Erstelle Testbenutzer...');
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'system.test@example.com' },
      update: { password: hashedPassword },
      create: {
        id: crypto.randomUUID(),
        email: 'system.test@example.com',
        password: hashedPassword,
        role: 'DOM',
        displayName: 'System Test User',
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Testbenutzer erstellt/aktualisiert');
    return user;
  } catch (error) {
    console.log('❌ Fehler beim Erstellen des Testbenutzers:', error.message);
    throw error;
  }
}

async function authenticateUser() {
  try {
    console.log('\n🔐 Authentifiziere Testbenutzer...');
    const response = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    });
    
    authToken = response.data.token;
    console.log('✅ Authentifizierung erfolgreich');
    return authToken;
  } catch (error) {
    console.log('❌ Authentifizierung fehlgeschlagen:', error.response?.data?.error || error.message);
    throw error;
  }
}

async function testDatabaseEntities() {
  console.log('\n📊 Teste Datenbank-Entitäten...');
  
  try {
    // Teste Stages
    const stages = await prisma.stage.findMany({
      include: {
        _count: {
          select: {
            Task: true,
            Rule: true,
            Goal: true,
            Initiationsriten: true,
            Privileg: true,
            Strafe: true,
            TPEEintrag: true
          }
        }
      },
      orderBy: { stageNumber: 'asc' }
    });
    
    console.log(`\n🎯 Gefundene Stufen (${stages.length}):`);
    stages.forEach(stage => {
      console.log(`  Stufe ${stage.stageNumber}: "${stage.name}" (id: ${stage.id})`);
      console.log(`    - Tasks: ${stage._count.Task}`);
      console.log(`    - Rules: ${stage._count.Rule}`);
      console.log(`    - Goals: ${stage._count.Goal}`);
      console.log(`    - Initiationsriten: ${stage._count.Initiationsriten}`);
      console.log(`    - Privilegien: ${stage._count.Privileg}`);
      console.log(`    - Strafen: ${stage._count.Strafe}`);
      console.log(`    - TPE: ${stage._count.TPEEintrag}`);
    });
    
    return stages;
  } catch (error) {
    console.log('❌ Fehler beim Testen der Datenbank:', error.message);
    throw error;
  }
}

async function testAPIEndpoints(stages) {
  console.log('\n🌐 Teste API-Endpoints...');
  const headers = { Authorization: `Bearer ${authToken}` };
  
  for (const stage of stages.slice(0, 2)) { // Teste nur die ersten 2 Stufen
    console.log(`\n📋 Teste Stufe ${stage.stageNumber}: "${stage.name}"`);
    
    // Test Initiationsriten
    try {
      const initResponse = await axios.get(`${baseURL}/api/initiationsriten?stageId=${stage.id}`, { headers });
      console.log(`  ✅ Initiationsriten: ${initResponse.data.data.length} gefunden`);
    } catch (error) {
      console.log(`  ❌ Initiationsriten Fehler: ${error.response?.status} - ${error.response?.data?.error}`);
    }
    
    // Test Privilegien
    try {
      const privResponse = await axios.get(`${baseURL}/api/privilegien?stageId=${stage.id}`, { headers });
      console.log(`  ✅ Privilegien: ${privResponse.data.data.length} gefunden`);
    } catch (error) {
      console.log(`  ❌ Privilegien Fehler: ${error.response?.status} - ${error.response?.data?.error}`);
    }
    
    // Test Strafen
    try {
      const strafenResponse = await axios.get(`${baseURL}/api/strafen?stageId=${stage.id}`, { headers });
      console.log(`  ✅ Strafen: ${strafenResponse.data.data.length} gefunden`);
    } catch (error) {
      console.log(`  ❌ Strafen Fehler: ${error.response?.status} - ${error.response?.data?.error}`);
    }
    
    // Test TPE
    try {
      const tpeResponse = await axios.get(`${baseURL}/api/tpe?stageId=${stage.id}`, { headers });
      console.log(`  ✅ TPE: ${tpeResponse.data.data.length} gefunden`);
    } catch (error) {
      console.log(`  ❌ TPE Fehler: ${error.response?.status} - ${error.response?.data?.error}`);
    }
    
    // Test Tasks
    try {
      const tasksResponse = await axios.get(`${baseURL}/api/tasks?stageId=${stage.id}`, { headers });
      console.log(`  ✅ Tasks: ${tasksResponse.data.data.length} gefunden`);
    } catch (error) {
      console.log(`  ❌ Tasks Fehler: ${error.response?.status} - ${error.response?.data?.error}`);
    }
    
    // Test Rules
    try {
      const rulesResponse = await axios.get(`${baseURL}/api/rules?stageId=${stage.id}`, { headers });
      console.log(`  ✅ Rules: ${rulesResponse.data.data.length} gefunden`);
    } catch (error) {
      console.log(`  ❌ Rules Fehler: ${error.response?.status} - ${error.response?.data?.error}`);
    }
  }
}

async function testStageIsolation() {
  console.log('\n🔒 Teste Stufen-Isolation...');
  
  const stages = await prisma.stage.findMany({ orderBy: { stageNumber: 'asc' } });
  if (stages.length < 2) {
    console.log('❌ Nicht genügend Stufen für Isolations-Test');
    return;
  }
  
  const stage1 = stages[0];
  const stage2 = stages[1];
  
  console.log(`Teste Isolation zwischen Stufe ${stage1.stageNumber} und ${stage2.stageNumber}`);
  
  // Erstelle eine Test-Entität in Stufe 1
  try {
    const testEntity = await prisma.initiationsriten.create({
      data: {
        id: crypto.randomUUID(),
        title: 'Test Isolation Entity',
        description: 'Test für Stufen-Isolation',
        creatorId: (await prisma.user.findFirst({ where: { role: 'DOM' } })).id,
        stageId: stage1.id,
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Test-Entität in Stufe 1 erstellt');
    
    // Teste ob sie nur in Stufe 1 sichtbar ist
    const headers = { Authorization: `Bearer ${authToken}` };
    
    const stage1Response = await axios.get(`${baseURL}/api/initiationsriten?stageId=${stage1.id}`, { headers });
    const stage1Count = stage1Response.data.data.length;
    
    const stage2Response = await axios.get(`${baseURL}/api/initiationsriten?stageId=${stage2.id}`, { headers });
    const stage2Count = stage2Response.data.data.length;
    
    console.log(`Initiationsriten in Stufe ${stage1.stageNumber}: ${stage1Count}`);
    console.log(`Initiationsriten in Stufe ${stage2.stageNumber}: ${stage2Count}`);
    
    // Prüfe ob Test-Entität nur in Stufe 1 erscheint
    const stage1HasTestEntity = stage1Response.data.data.some(item => item.id === testEntity.id);
    const stage2HasTestEntity = stage2Response.data.data.some(item => item.id === testEntity.id);
    
    if (stage1HasTestEntity && !stage2HasTestEntity) {
      console.log('✅ Stufen-Isolation funktioniert korrekt');
    } else {
      console.log('❌ Stufen-Isolation fehlgeschlagen');
      console.log(`  Test-Entität in Stufe 1: ${stage1HasTestEntity}`);
      console.log(`  Test-Entität in Stufe 2: ${stage2HasTestEntity}`);
    }
    
    // Aufräumen
    await prisma.initiationsriten.delete({ where: { id: testEntity.id } });
    console.log('🧹 Test-Entität gelöscht');
    
  } catch (error) {
    console.log('❌ Fehler beim Testen der Stufen-Isolation:', error.message);
  }
}

async function testCounterSystem() {
  console.log('\n🔢 Teste Zähler-System...');
  
  try {
    const stages = await prisma.stage.findMany({
      include: {
        _count: {
          select: {
            Task: true,
            Rule: true,
            Goal: true,
            Initiationsriten: true,
            Privileg: true,
            Strafe: true,
            TPEEintrag: true
          }
        }
      },
      orderBy: { stageNumber: 'asc' }
    });
    
    console.log('📊 Zähler-Ergebnisse:');
    stages.forEach(stage => {
      const totalEntities = stage._count.Task + stage._count.Rule + stage._count.Goal + 
                          stage._count.Initiationsriten + stage._count.Privileg + 
                          stage._count.Strafe + stage._count.TPEEintrag;
      
      console.log(`  Stufe ${stage.stageNumber} "${stage.name}": ${totalEntities} Entitäten gesamt`);
      if (totalEntities > 0) {
        console.log(`    Aufgaben: ${stage._count.Task}, Regeln: ${stage._count.Rule}`);
        console.log(`    Ziele: ${stage._count.Goal}, Initiationsriten: ${stage._count.Initiationsriten}`);
        console.log(`    Privilegien: ${stage._count.Privileg}, Strafen: ${stage._count.Strafe}`);
        console.log(`    TPE: ${stage._count.TPEEintrag}`);
      }
    });
    
    // Teste API-basierte Zähler
    const headers = { Authorization: `Bearer ${authToken}` };
    const stagesResponse = await axios.get(`${baseURL}/api/stages`, { headers });
    
    console.log('\n🌐 API-basierte Zähler:');
    stagesResponse.data.forEach(stage => {
      if (stage._count) {
        const apiTotal = Object.values(stage._count).reduce((sum, count) => sum + count, 0);
        console.log(`  API Stufe ${stage.stageNumber}: ${apiTotal} Entitäten`);
      }
    });
    
    console.log('✅ Zähler-System getestet');
    
  } catch (error) {
    console.log('❌ Fehler beim Testen des Zähler-Systems:', error.response?.data || error.message);
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starte umfassenden Stufensystem-Test\n');
  
  try {
    // Setup
    await createTestUser();
    await authenticateUser();
    
    // Tests ausführen
    const stages = await testDatabaseEntities();
    
    await testAPIEndpoints(stages);
    await testStageIsolation();
    await testCounterSystem();
    
    console.log('\n🎉 Umfassender Test abgeschlossen!');
    
  } catch (error) {
    console.error('❌ Test fehlgeschlagen:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runComprehensiveTest();
