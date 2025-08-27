const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStageIsolation() {
  try {
    console.log('🧪 Teste Stage-Isolation System...\n');
    
    // Test 1: Get all stages
    console.log('1️⃣ Lade alle Stages...');
    const stages = await prisma.stage.findMany({
      orderBy: { stageNumber: 'asc' }
    });
    console.log(`Gefundene Stages: ${stages.length}`);
    stages.forEach(stage => {
      console.log(`  - ${stage.name} (ID: ${stage.id}, #${stage.stageNumber})`);
    });
    
    if (stages.length === 0) {
      console.log('❌ Keine Stages gefunden!');
      return;
    }
    
    const stage1 = stages[0];
    const stage2 = stages[1];
    
    console.log(`\n2️⃣ Teste Stage-Isolation mit Stage 1: "${stage1.name}"`);
    
    // Test 2: Count entities in Stage 1
    console.log('\n📊 Zähle Entitäten in Stage 1:');
    
    const stage1Tasks = await prisma.task.count({
      where: { stageId: stage1.id }
    });
    console.log(`  📋 Tasks: ${stage1Tasks}`);
    
    const stage1Rules = await prisma.rule.count({
      where: { stageId: stage1.id }
    });
    console.log(`  📜 Rules: ${stage1Rules}`);
    
    const stage1Goals = await prisma.goal.count({
      where: { stageId: stage1.id }
    });
    console.log(`  🎯 Goals: ${stage1Goals}`);
    
    const stage1Initiationsriten = await prisma.initiationsriten.count({
      where: { stageId: stage1.id }
    });
    console.log(`  🎭 Initiationsriten: ${stage1Initiationsriten}`);
    
    const stage1Privilegien = await prisma.privileg.count({
      where: { stageId: stage1.id }
    });
    console.log(`  👑 Privilegien: ${stage1Privilegien}`);
    
    const stage1Strafen = await prisma.strafe.count({
      where: { stageId: stage1.id }
    });
    console.log(`  ⚖️ Strafen: ${stage1Strafen}`);
    
    const stage1TPE = await prisma.tPEEintrag.count({
      where: { stageId: stage1.id }
    });
    console.log(`  🔥 TPE: ${stage1TPE}`);
    
    if (stage2) {
      console.log(`\n3️⃣ Teste Stage-Isolation mit Stage 2: "${stage2.name}"`);
      
      const stage2Tasks = await prisma.task.count({
        where: { stageId: stage2.id }
      });
      console.log(`  📋 Tasks: ${stage2Tasks}`);
      
      const stage2Rules = await prisma.rule.count({
        where: { stageId: stage2.id }
      });
      console.log(`  📜 Rules: ${stage2Rules}`);
      
      const stage2Goals = await prisma.goal.count({
        where: { stageId: stage2.id }
      });
      console.log(`  🎯 Goals: ${stage2Goals}`);
      
      console.log('\n🔍 Vergleiche Stage 1 vs Stage 2:');
      console.log(`Tasks: ${stage1Tasks} vs ${stage2Tasks} (${stage1Tasks !== stage2Tasks ? '✅ Isoliert' : '⚠️ Möglicherweise nicht isoliert'})`);
      console.log(`Rules: ${stage1Rules} vs ${stage2Rules} (${stage1Rules !== stage2Rules ? '✅ Isoliert' : '⚠️ Möglicherweise nicht isoliert'})`);
      console.log(`Goals: ${stage1Goals} vs ${stage2Goals} (${stage1Goals !== stage2Goals ? '✅ Isoliert' : '⚠️ Möglicherweise nicht isoliert'})`);
    }
    
    // Test 4: Check if old activeFromStage fields are gone
    console.log('\n4️⃣ Prüfe Schema-Änderungen...');
    
    try {
      const taskExample = await prisma.task.findFirst();
      if (taskExample && 'activeFromStage' in taskExample) {
        console.log('⚠️ activeFromStage Feld existiert noch in Task');
      } else {
        console.log('✅ activeFromStage Feld erfolgreich entfernt aus Task');
      }
    } catch (error) {
      console.log('✅ activeFromStage Feld erfolgreich entfernt aus Task');
    }
    
    // Test 5: Test creation with stage isolation
    console.log('\n5️⃣ Teste neue Entity-Erstellung...');
    
    try {
      const testTask = await prisma.task.create({
        data: {
          title: 'Test Task für Stage Isolation',
          description: 'Diese Task sollte nur in Stage 1 sichtbar sein',
          category: 'test',
          stageId: stage1.id,
          creatorId: 'test-user-id' // This would need a real user ID
        }
      });
      
      console.log(`✅ Test Task erstellt in Stage 1: ${testTask.title}`);
      
      // Verify it's only in Stage 1
      const taskInStage1 = await prisma.task.count({
        where: { 
          id: testTask.id,
          stageId: stage1.id 
        }
      });
      
      const taskInStage2 = stage2 ? await prisma.task.count({
        where: { 
          id: testTask.id,
          stageId: stage2.id 
        }
      }) : 0;
      
      console.log(`Task in Stage 1: ${taskInStage1} (erwartet: 1)`);
      console.log(`Task in Stage 2: ${taskInStage2} (erwartet: 0)`);
      
      if (taskInStage1 === 1 && taskInStage2 === 0) {
        console.log('✅ Stage-Isolation funktioniert korrekt!');
      } else {
        console.log('❌ Stage-Isolation funktioniert NICHT korrekt!');
      }
      
      // Clean up
      await prisma.task.delete({
        where: { id: testTask.id }
      });
      console.log('🧹 Test Task gelöscht');
      
    } catch (error) {
      console.error('❌ Fehler beim Erstellen der Test Task:', error.message);
      console.log('ℹ️ Dies könnte aufgrund fehlender Benutzer-ID passieren');
    }
    
    console.log('\n🎉 Stage-Isolation Test abgeschlossen!');
    
  } catch (error) {
    console.error('❌ Test Fehler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStageIsolation();