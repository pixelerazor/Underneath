const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listAllEntities() {
  try {
    console.log('📋 Alle Entitäten in der Datenbank:\n');
    
    // Get all stages first for reference
    const stages = await prisma.stage.findMany({
      orderBy: { stageNumber: 'asc' }
    });
    
    const stageMap = {};
    stages.forEach(stage => {
      stageMap[stage.id] = `${stage.name} (Stufe ${stage.stageNumber})`;
    });
    
    console.log('🏆 STAGES:');
    stages.forEach(stage => {
      console.log(`  - ${stage.name} (Stufe ${stage.stageNumber}) - ID: ${stage.id}`);
    });
    console.log('');
    
    // Tasks
    console.log('📋 TASKS:');
    const tasks = await prisma.task.findMany({
      include: {
        Stage: true,
        User_Task_creatorIdToUser: { select: { displayName: true, email: true } }
      },
      orderBy: [{ Stage: { stageNumber: 'asc' } }, { createdAt: 'desc' }]
    });
    
    if (tasks.length === 0) {
      console.log('  (keine Tasks vorhanden)');
    } else {
      tasks.forEach(task => {
        const stageName = task.Stage ? `${task.Stage.name} (Stufe ${task.Stage.stageNumber})` : 'Unbekannte Stage';
        const creator = task.User_Task_creatorIdToUser?.displayName || task.User_Task_creatorIdToUser?.email || 'Unbekannt';
        console.log(`  - "${task.title}" in ${stageName} von ${creator}`);
        console.log(`    Status: ${task.status}, Kategorie: ${task.category}, Punkte: ${task.pointsReward}`);
      });
    }
    console.log('');
    
    // Rules
    console.log('📜 RULES:');
    const rules = await prisma.rule.findMany({
      include: {
        Stage: true,
        User_Rule_creatorIdToUser: { select: { displayName: true, email: true } }
      },
      orderBy: [{ Stage: { stageNumber: 'asc' } }, { createdAt: 'desc' }]
    });
    
    if (rules.length === 0) {
      console.log('  (keine Rules vorhanden)');
    } else {
      rules.forEach(rule => {
        const stageName = rule.Stage ? `${rule.Stage.name} (Stufe ${rule.Stage.stageNumber})` : 'Unbekannte Stage';
        const creator = rule.User_Rule_creatorIdToUser?.displayName || rule.User_Rule_creatorIdToUser?.email || 'Unbekannt';
        console.log(`  - "${rule.title}" in ${stageName} von ${creator}`);
        console.log(`    Schwere: ${rule.severity}, Kategorie: ${rule.category}, Strafpunkte: ${rule.pointsPenalty}`);
      });
    }
    console.log('');
    
    // Goals
    console.log('🎯 GOALS:');
    const goals = await prisma.goal.findMany({
      include: {
        Stage: true,
        User_Goal_creatorIdToUser: { select: { displayName: true, email: true } }
      },
      orderBy: [{ Stage: { stageNumber: 'asc' } }, { createdAt: 'desc' }]
    });
    
    if (goals.length === 0) {
      console.log('  (keine Goals vorhanden)');
    } else {
      goals.forEach(goal => {
        const stageName = goal.Stage ? `${goal.Stage.name} (Stufe ${goal.Stage.stageNumber})` : 'Unbekannte Stage';
        const creator = goal.User_Goal_creatorIdToUser?.displayName || goal.User_Goal_creatorIdToUser?.email || 'Unbekannt';
        console.log(`  - "${goal.title}" in ${stageName} von ${creator}`);
        console.log(`    Status: ${goal.status}, Fortschritt: ${goal.currentValue}/${goal.targetValue || '∞'}, Punkte: ${goal.pointsReward}`);
      });
    }
    console.log('');
    
    // Initiationsriten
    console.log('🎭 INITIATIONSRITEN:');
    const initiationsriten = await prisma.initiationsriten.findMany({
      include: {
        Stage: true,
        User: { select: { displayName: true, email: true } }
      },
      orderBy: [{ Stage: { stageNumber: 'asc' } }, { createdAt: 'desc' }]
    });
    
    if (initiationsriten.length === 0) {
      console.log('  (keine Initiationsriten vorhanden)');
    } else {
      initiationsriten.forEach(item => {
        const stageName = item.Stage ? `${item.Stage.name} (Stufe ${item.Stage.stageNumber})` : 'Unbekannte Stage';
        const creator = item.User?.displayName || item.User?.email || 'Unbekannt';
        console.log(`  - "${item.title}" in ${stageName} von ${creator}`);
        console.log(`    Typ: ${item.ritualType || 'Nicht spezifiziert'}, Einverständnis: ${item.explicitConsent ? 'Ja' : 'Nein'}`);
      });
    }
    console.log('');
    
    // Privilegien
    console.log('👑 PRIVILEGIEN:');
    const privilegien = await prisma.privileg.findMany({
      include: {
        Stage: true,
        User_Privileg_creatorIdToUser: { select: { displayName: true, email: true } },
        User_Privileg_grantedToIdToUser: { select: { displayName: true, email: true } }
      },
      orderBy: [{ Stage: { stageNumber: 'asc' } }, { createdAt: 'desc' }]
    });
    
    if (privilegien.length === 0) {
      console.log('  (keine Privilegien vorhanden)');
    } else {
      privilegien.forEach(item => {
        const stageName = item.Stage ? `${item.Stage.name} (Stufe ${item.Stage.stageNumber})` : 'Unbekannte Stage';
        const creator = item.User_Privileg_creatorIdToUser?.displayName || item.User_Privileg_creatorIdToUser?.email || 'Unbekannt';
        const grantedTo = item.User_Privileg_grantedToIdToUser?.displayName || item.User_Privileg_grantedToIdToUser?.email || 'Niemand';
        console.log(`  - "${item.title}" in ${stageName} von ${creator}`);
        console.log(`    Typ: ${item.type || 'Nicht spezifiziert'}, Gewährt an: ${grantedTo}, Aktiv: ${item.isActive ? 'Ja' : 'Nein'}`);
      });
    }
    console.log('');
    
    // Strafen
    console.log('⚖️ STRAFEN:');
    const strafen = await prisma.strafe.findMany({
      include: {
        Stage: true,
        User_Strafe_userIdToUser: { select: { displayName: true, email: true } },
        User_Strafe_adminByToUser: { select: { displayName: true, email: true } }
      },
      orderBy: [{ Stage: { stageNumber: 'asc' } }, { createdAt: 'desc' }]
    });
    
    if (strafen.length === 0) {
      console.log('  (keine Strafen vorhanden)');
    } else {
      strafen.forEach(item => {
        const stageName = item.Stage ? `${item.Stage.name} (Stufe ${item.Stage.stageNumber})` : 'Unbekannte Stage';
        const user = item.User_Strafe_userIdToUser?.displayName || item.User_Strafe_userIdToUser?.email || 'Unbekannt';
        const admin = item.User_Strafe_adminByToUser?.displayName || item.User_Strafe_adminByToUser?.email || 'System';
        console.log(`  - "${item.title}" in ${stageName} für ${user} von ${admin}`);
        console.log(`    Schwere: ${item.severity || 'Nicht spezifiziert'}, Abgeschlossen: ${item.isCompleted ? 'Ja' : 'Nein'}`);
      });
    }
    console.log('');
    
    // TPE Einträge
    console.log('🔥 TPE EINTRÄGE:');
    const tpe = await prisma.tPEEintrag.findMany({
      include: {
        Stage: true,
        User: { select: { displayName: true, email: true } }
      },
      orderBy: [{ Stage: { stageNumber: 'asc' } }, { createdAt: 'desc' }]
    });
    
    if (tpe.length === 0) {
      console.log('  (keine TPE Einträge vorhanden)');
    } else {
      tpe.forEach(item => {
        const stageName = item.Stage ? `${item.Stage.name} (Stufe ${item.Stage.stageNumber})` : 'Unbekannte Stage';
        const user = item.User?.displayName || item.User?.email || 'Unbekannt';
        console.log(`  - "${item.title}" in ${stageName} von ${user}`);
        console.log(`    Typ: ${item.type || 'Nicht spezifiziert'}, Intensität: ${item.intensity || 'Nicht bewertet'}/10`);
      });
    }
    console.log('');
    
    // Summary
    console.log('📊 ZUSAMMENFASSUNG:');
    console.log(`  🏆 Stages: ${stages.length}`);
    console.log(`  📋 Tasks: ${tasks.length}`);
    console.log(`  📜 Rules: ${rules.length}`);
    console.log(`  🎯 Goals: ${goals.length}`);
    console.log(`  🎭 Initiationsriten: ${initiationsriten.length}`);
    console.log(`  👑 Privilegien: ${privilegien.length}`);
    console.log(`  ⚖️ Strafen: ${strafen.length}`);
    console.log(`  🔥 TPE Einträge: ${tpe.length}`);
    console.log(`  📈 Gesamt Entitäten: ${tasks.length + rules.length + goals.length + initiationsriten.length + privilegien.length + strafen.length + tpe.length}`);
    
    // Stage distribution
    console.log('\n🎯 VERTEILUNG PRO STAGE:');
    stages.forEach(stage => {
      const stageTaskCount = tasks.filter(t => t.stageId === stage.id).length;
      const stageRuleCount = rules.filter(r => r.stageId === stage.id).length;
      const stageGoalCount = goals.filter(g => g.stageId === stage.id).length;
      const stageInitCount = initiationsriten.filter(i => i.stageId === stage.id).length;
      const stagePrivCount = privilegien.filter(p => p.stageId === stage.id).length;
      const stageStrafenCount = strafen.filter(s => s.stageId === stage.id).length;
      const stageTPECount = tpe.filter(t => t.stageId === stage.id).length;
      
      const total = stageTaskCount + stageRuleCount + stageGoalCount + stageInitCount + stagePrivCount + stageStrafenCount + stageTPECount;
      
      console.log(`  ${stage.name} (Stufe ${stage.stageNumber}): ${total} Entitäten`);
      console.log(`    📋 ${stageTaskCount} Tasks, 📜 ${stageRuleCount} Rules, 🎯 ${stageGoalCount} Goals`);
      console.log(`    🎭 ${stageInitCount} Initiationsriten, 👑 ${stagePrivCount} Privilegien, ⚖️ ${stageStrafenCount} Strafen, 🔥 ${stageTPECount} TPE`);
    });
    
  } catch (error) {
    console.error('❌ Fehler beim Laden der Entitäten:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllEntities();