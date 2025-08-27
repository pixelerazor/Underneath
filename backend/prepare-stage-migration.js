const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function prepareStageIsolation() {
  try {
    console.log('🔧 Bereite Stage-Isolation vor...');
    
    // Step 1: Ensure we have Stage records
    console.log('\n1️⃣ Prüfe Stages...');
    const stages = await prisma.stage.findMany({
      orderBy: { stageNumber: 'asc' }
    });
    console.log(`Gefundene Stages: ${stages.length}`);
    
    if (stages.length === 0) {
      console.log('❌ Keine Stages gefunden! Erstelle Standard-Stages...');
      for (let i = 1; i <= 5; i++) {
        await prisma.stage.create({
          data: {
            id: `stage-${i}`,
            stageNumber: i,
            name: `Stufe ${i}`,
            pointsRequired: i * 100,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
          }
        });
        console.log(`✅ Stage ${i} erstellt`);
      }
    }
    
    const stageMap = await prisma.stage.findMany();
    const stage1 = stageMap.find(s => s.stageNumber === 1);
    
    if (!stage1) {
      throw new Error('Stage 1 nicht gefunden!');
    }
    
    console.log(`Standard-Stage ID: ${stage1.id}`);
    
    // Step 2: Update existing entities to have proper stageId
    console.log('\n2️⃣ Aktualisiere bestehende Entitäten...');
    
    // Tasks
    const tasksToUpdate = await prisma.task.findMany({
      where: { stageId: null }
    });
    console.log(`Tasks ohne stageId: ${tasksToUpdate.length}`);
    for (const task of tasksToUpdate) {
      // Use activeFromStage to determine the right stage
      const targetStage = stageMap.find(s => s.stageNumber === (task.activeFromStage || 1));
      await prisma.task.update({
        where: { id: task.id },
        data: { stageId: targetStage?.id || stage1.id }
      });
      console.log(`  ✅ Task "${task.title}" → Stage ${targetStage?.stageNumber || 1}`);
    }
    
    // Rules
    const rulesToUpdate = await prisma.rule.findMany({
      where: { stageId: null }
    });
    console.log(`Rules ohne stageId: ${rulesToUpdate.length}`);
    for (const rule of rulesToUpdate) {
      const targetStage = stageMap.find(s => s.stageNumber === (rule.activeFromStage || 1));
      await prisma.rule.update({
        where: { id: rule.id },
        data: { stageId: targetStage?.id || stage1.id }
      });
      console.log(`  ✅ Rule "${rule.title}" → Stage ${targetStage?.stageNumber || 1}`);
    }
    
    // Goals
    const goalsToUpdate = await prisma.goal.findMany({
      where: { stageId: null }
    });
    console.log(`Goals ohne stageId: ${goalsToUpdate.length}`);
    for (const goal of goalsToUpdate) {
      const targetStage = stageMap.find(s => s.stageNumber === (goal.activeFromStage || 1));
      await prisma.goal.update({
        where: { id: goal.id },
        data: { stageId: targetStage?.id || stage1.id }
      });
      console.log(`  ✅ Goal "${goal.title}" → Stage ${targetStage?.stageNumber || 1}`);
    }
    
    // Initiationsriten
    const initiationsritenToUpdate = await prisma.initiationsriten.findMany({
      where: { stageId: null }
    });
    console.log(`Initiationsriten ohne stageId: ${initiationsritenToUpdate.length}`);
    for (const item of initiationsritenToUpdate) {
      const targetStage = stageMap.find(s => s.stageNumber === (item.activeFromStage || 1));
      await prisma.initiationsriten.update({
        where: { id: item.id },
        data: { stageId: targetStage?.id || stage1.id }
      });
      console.log(`  ✅ Initiationsriten "${item.title}" → Stage ${targetStage?.stageNumber || 1}`);
    }
    
    // Privilegien
    const privilegienToUpdate = await prisma.privileg.findMany({
      where: { stageId: null }
    });
    console.log(`Privilegien ohne stageId: ${privilegienToUpdate.length}`);
    for (const item of privilegienToUpdate) {
      const targetStage = stageMap.find(s => s.stageNumber === (item.activeFromStage || 1));
      await prisma.privileg.update({
        where: { id: item.id },
        data: { stageId: targetStage?.id || stage1.id }
      });
      console.log(`  ✅ Privileg "${item.title}" → Stage ${targetStage?.stageNumber || 1}`);
    }
    
    // Strafen - add stageId first (they don't have it yet)
    const strafenCount = await prisma.strafe.count();
    console.log(`Strafen gefunden: ${strafenCount}`);
    if (strafenCount > 0) {
      // We'll need to add stageId in the migration
      console.log('  → Strafen werden in der Migration aktualisiert');
    }
    
    // TPE Einträge - add stageId first (they don't have it yet)
    const tpeCount = await prisma.tPEEintrag.count();
    console.log(`TPE Einträge gefunden: ${tpeCount}`);
    if (tpeCount > 0) {
      // We'll need to add stageId in the migration
      console.log('  → TPE Einträge werden in der Migration aktualisiert');
    }
    
    console.log('\n✅ Vorbereitung abgeschlossen!');
    console.log('\n🚀 Jetzt kann die Prisma Migration ausgeführt werden');
    
  } catch (error) {
    console.error('❌ Fehler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

prepareStageIsolation();