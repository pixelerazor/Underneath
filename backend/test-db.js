const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Überprüfung der Datenbank...');
    
    const taskCount = await prisma.task.count();
    console.log(`📋 Aufgaben: ${taskCount}`);
    
    const ruleCount = await prisma.rule.count();
    console.log(`📜 Regeln: ${ruleCount}`);
    
    const goalCount = await prisma.goal.count();
    console.log(`🎯 Ziele: ${goalCount}`);
    
    let initiationsritenCount = 0;
    try {
      initiationsritenCount = await prisma.initiationsriten.count();
    } catch (e) {
      console.log('⚠️ Initiationsriten Tabelle Problem:', e.message);
      try {
        initiationsritenCount = await prisma.initiationsritus.count();
        console.log('✅ Gefunden als Initiationsritus (singular)');
      } catch (e2) {
        console.log('⚠️ Weder Initiationsriten noch Initiationsritus funktioniert:', e2.message);
      }
    }
    console.log(`🎭 Initiationsriten: ${initiationsritenCount}`);
    
    let privilegienCount = 0;
    try {
      privilegienCount = await prisma.privileg.count();
    } catch (e) {
      console.log('⚠️ Privileg Tabelle existiert nicht oder hat ein Problem');
    }
    console.log(`👑 Privilegien: ${privilegienCount}`);
    
    let strafenCount = 0;
    try {
      strafenCount = await prisma.strafe.count();
    } catch (e) {
      console.log('⚠️ Strafe Tabelle existiert nicht oder hat ein Problem');
    }
    console.log(`⚖️ Strafen: ${strafenCount}`);
    
    let tpeCount = 0;
    try {
      tpeCount = await prisma.tPEEintrag.count();
    } catch (e) {
      console.log('⚠️ TPEEintrag Tabelle existiert nicht oder hat ein Problem');
    }
    console.log(`🔥 TPE Einträge: ${tpeCount}`);
    
    const userCount = await prisma.user.count();
    console.log(`👥 Benutzer: ${userCount}`);
    
    console.log('\n🔍 Erste paar Aufgaben:');
    const tasks = await prisma.task.findMany({ take: 3 });
    tasks.forEach(task => console.log(`  - ${task.title} (Stufe: ${task.activeFromStage})`));
    
    console.log('\n🔍 Erste paar Strafen:');
    try {
      const strafen = await prisma.strafe.findMany({ take: 3 });
      if (strafen.length === 0) {
        console.log('  Keine Strafen gefunden');
      } else {
        strafen.forEach(strafe => console.log(`  - ${strafe.title} (Stufe: ${strafe.activeFromStage})`));
      }
    } catch (e) {
      console.log('  Fehler beim Abrufen der Strafen:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Fehler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();