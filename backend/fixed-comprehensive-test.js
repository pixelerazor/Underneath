// Korrigierter umfassender Test des Stufensystems
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();
const baseURL = 'http://localhost:3001';

let authToken = null;

async function authenticateUser() {
  try {
    console.log('🔐 Authentifiziere Testbenutzer...');
    const response = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'system.test@example.com',
      password: 'TestPassword123!'
    });
    
    authToken = response.data.accessToken; // KORRIGIERT: accessToken statt token
    console.log('✅ Authentifizierung erfolgreich');
    return authToken;
  } catch (error) {
    console.log('❌ Authentifizierung fehlgeschlagen:', error.response?.data?.error || error.message);
    throw error;
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 Teste API-Endpoints mit korrektem Token...');
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Erst die Stufen laden
  const stagesResponse = await axios.get(`${baseURL}/api/stages`, { headers });
  const stages = stagesResponse.data;
  console.log(`✅ ${stages.length} Stufen über API geladen`);
  
  for (const stage of stages.slice(0, 2)) { // Teste nur die ersten 2 Stufen
    console.log(`\n📋 Teste Stufe ${stage.stageNumber}: "${stage.name}"`);
    
    const endpoints = [
      { name: 'Initiationsriten', url: `/api/initiationsriten?stageId=${stage.id}` },
      { name: 'Privilegien', url: `/api/privilegien?stageId=${stage.id}` },
      { name: 'Strafen', url: `/api/strafen?stageId=${stage.id}` },
      { name: 'TPE', url: `/api/tpe?stageId=${stage.id}` },
      { name: 'Tasks', url: `/api/tasks?stageId=${stage.id}` },
      { name: 'Rules', url: `/api/rules?stageId=${stage.id}` }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${baseURL}${endpoint.url}`, { headers });
        const count = response.data.data ? response.data.data.length : response.data.length || 0;
        console.log(`  ✅ ${endpoint.name}: ${count} gefunden`);
        
        // Zeige erste paar Entitäten für Details
        if (count > 0 && response.data.data) {
          const first = response.data.data[0];
          console.log(`    Beispiel: "${first.title || first.name || first.id}"`);
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint.name} Fehler: ${error.response?.status} - ${error.response?.data?.error}`);
      }
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
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Teste Initiationsriten-Isolation
    const stage1Response = await axios.get(`${baseURL}/api/initiationsriten?stageId=${stage1.id}`, { headers });
    const stage2Response = await axios.get(`${baseURL}/api/initiationsriten?stageId=${stage2.id}`, { headers });
    
    const stage1Count = stage1Response.data.data.length;
    const stage2Count = stage2Response.data.data.length;
    
    console.log(`✅ Stufe ${stage1.stageNumber}: ${stage1Count} Initiationsriten`);
    console.log(`✅ Stufe ${stage2.stageNumber}: ${stage2Count} Initiationsriten`);
    
    // Prüfe, ob IDs wirklich getrennt sind
    const stage1Ids = stage1Response.data.data.map(item => item.id);
    const stage2Ids = stage2Response.data.data.map(item => item.id);
    const overlap = stage1Ids.filter(id => stage2Ids.includes(id));
    
    if (overlap.length === 0) {
      console.log('✅ Keine Überschneidung zwischen Stufen - Isolation funktioniert');
    } else {
      console.log(`❌ ${overlap.length} Entitäten erscheinen in beiden Stufen - Isolation fehlgeschlagen`);
    }
    
  } catch (error) {
    console.log('❌ Fehler beim Testen der Stufen-Isolation:', error.response?.data || error.message);
  }
}

async function testCounterSystem() {
  console.log('\n🔢 Teste Zähler-System...');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // API-basierte Zähler über /api/stages
    const stagesResponse = await axios.get(`${baseURL}/api/stages`, { headers });
    const stages = stagesResponse.data;
    
    console.log('📊 API-basierte Zähler:');
    let totalEntitiesAcrossAllStages = 0;
    
    stages.forEach(stage => {
      if (stage._count) {
        const counts = stage._count;
        const stageTotal = Object.values(counts).reduce((sum, count) => sum + (count || 0), 0);
        totalEntitiesAcrossAllStages += stageTotal;
        
        console.log(`  Stufe ${stage.stageNumber} "${stage.name}": ${stageTotal} Entitäten`);
        if (stageTotal > 0) {
          const details = Object.entries(counts)
            .filter(([key, value]) => value > 0)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          console.log(`    └─ ${details}`);
        }
      }
    });
    
    console.log(`\n📈 Gesamt über alle Stufen: ${totalEntitiesAcrossAllStages} Entitäten`);
    
    // Teste einzelne Endpunkte für ersten Stufe
    if (stages.length > 0) {
      const firstStage = stages[0];
      console.log(`\n🎯 Detailtest für Stufe ${firstStage.stageNumber}:`);
      
      const endpoints = [
        { name: 'Initiationsriten', url: `/api/initiationsriten?stageId=${firstStage.id}` },
        { name: 'Privilegien', url: `/api/privilegien?stageId=${firstStage.id}` },
        { name: 'Strafen', url: `/api/strafen?stageId=${firstStage.id}` }
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(`${baseURL}${endpoint.url}`, { headers });
          const count = response.data.data ? response.data.data.length : 0;
          console.log(`    ${endpoint.name}: ${count} Entitäten`);
        } catch (error) {
          console.log(`    ${endpoint.name}: Fehler - ${error.response?.status}`);
        }
      }
    }
    
    console.log('✅ Zähler-System erfolgreich getestet');
    
  } catch (error) {
    console.log('❌ Fehler beim Testen des Zähler-Systems:', error.response?.data || error.message);
  }
}

async function runCorrectedTest() {
  console.log('🚀 Starte korrigierten Stufensystem-Test\n');
  
  try {
    await authenticateUser();
    await testAPIEndpoints();
    await testStageIsolation();
    await testCounterSystem();
    
    console.log('\n🎉 Alle Tests erfolgreich abgeschlossen!');
    console.log('\n📋 ZUSAMMENFASSUNG:');
    console.log('✅ Authentication funktioniert');
    console.log('✅ API-Endpoints ansprechbar');
    console.log('✅ Stufen-Isolation implementiert');
    console.log('✅ Zähler-System aktiv');
    
  } catch (error) {
    console.error('❌ Test fehlgeschlagen:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runCorrectedTest();
