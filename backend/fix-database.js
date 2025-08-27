const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log('🔧 Repariere Datenbank-Einträge...');
    
    // 1. Fix Strafen - add activeFromStage if missing
    console.log('\n📋 Aktualisiere Strafen...');
    const strafenWithoutStage = await prisma.strafe.findMany({
      where: { activeFromStage: null }
    });
    
    for (const strafe of strafenWithoutStage) {
      await prisma.strafe.update({
        where: { id: strafe.id },
        data: { activeFromStage: 1 } // Default to stage 1
      });
      console.log(`  ✅ Strafe "${strafe.title}" -> Stufe 1`);
    }
    
    // 2. Fix Tasks - ensure they have activeFromStage
    console.log('\n📋 Aktualisiere Aufgaben...');
    const tasksWithoutStage = await prisma.task.findMany({
      where: { activeFromStage: null }
    });
    
    for (const task of tasksWithoutStage) {
      await prisma.task.update({
        where: { id: task.id },
        data: { activeFromStage: 1 }
      });
      console.log(`  ✅ Aufgabe "${task.title}" -> Stufe 1`);
    }
    
    // 3. Fix Rules - ensure they have activeFromStage  
    console.log('\n📜 Aktualisiere Regeln...');
    const rulesWithoutStage = await prisma.rule.findMany({
      where: { activeFromStage: null }
    });
    
    for (const rule of rulesWithoutStage) {
      await prisma.rule.update({
        where: { id: rule.id },
        data: { activeFromStage: 1 }
      });
      console.log(`  ✅ Regel "${rule.title}" -> Stufe 1`);
    }
    
    // 4. Fix Goals - ensure they have activeFromStage
    console.log('\n🎯 Aktualisiere Ziele...');
    const goalsWithoutStage = await prisma.goal.findMany({
      where: { activeFromStage: null }
    });
    
    for (const goal of goalsWithoutStage) {
      await prisma.goal.update({
        where: { id: goal.id },
        data: { activeFromStage: 1 }
      });
      console.log(`  ✅ Ziel "${goal.title}" -> Stufe 1`);
    }
    
    // 5. Fix Privilegien - ensure they have activeFromStage
    console.log('\n👑 Aktualisiere Privilegien...');
    const privilegienWithoutStage = await prisma.privileg.findMany({
      where: { activeFromStage: null }
    });
    
    for (const privileg of privilegienWithoutStage) {
      await prisma.privileg.update({
        where: { id: privileg.id },
        data: { activeFromStage: 1 }
      });
      console.log(`  ✅ Privileg "${privileg.title}" -> Stufe 1`);
    }
    
    console.log('\n🎉 Datenbank erfolgreich repariert!');
    
    // Verify the fixes
    console.log('\n🔍 Überprüfung nach Reparatur:');
    const taskCount = await prisma.task.count({ where: { activeFromStage: { gte: 1 } } });
    const ruleCount = await prisma.rule.count({ where: { activeFromStage: { gte: 1 } } });
    const goalCount = await prisma.goal.count({ where: { activeFromStage: { gte: 1 } } });
    const privilegienCount = await prisma.privileg.count({ where: { activeFromStage: { gte: 1 } } });
    const strafenCount = await prisma.strafe.count({ where: { activeFromStage: { gte: 1 } } });
    
    console.log(`📋 Aufgaben mit Stufe: ${taskCount}`);
    console.log(`📜 Regeln mit Stufe: ${ruleCount}`);
    console.log(`🎯 Ziele mit Stufe: ${goalCount}`);
    console.log(`👑 Privilegien mit Stufe: ${privilegienCount}`);
    console.log(`⚖️ Strafen mit Stufe: ${strafenCount}`);
    
  } catch (error) {
    console.error('❌ Fehler bei der Datenbank-Reparatur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase();