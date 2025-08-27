const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixGoals() {
  try {
    console.log('🔧 Repariere Goals...');
    
    // Check all goals
    const allGoals = await prisma.goal.findMany();
    console.log(`Gefundene Goals: ${allGoals.length}`);
    
    for (const goal of allGoals) {
      console.log(`Goal "${goal.title}": activeFromStage = ${goal.activeFromStage}`);
      
      if (!goal.activeFromStage || goal.activeFromStage === 0) {
        await prisma.goal.update({
          where: { id: goal.id },
          data: { activeFromStage: 1 }
        });
        console.log(`  ✅ Updated "${goal.title}" -> activeFromStage = 1`);
      }
    }
    
    // Test again
    const goalsForStage1 = await prisma.goal.findMany({
      where: { activeFromStage: { lte: 1 } }
    });
    console.log(`Goals für Stufe 1: ${goalsForStage1.length}`);
    
    console.log('✅ Goals repariert!');
    
  } catch (error) {
    console.error('❌ Fehler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixGoals();