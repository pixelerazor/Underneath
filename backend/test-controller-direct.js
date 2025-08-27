// Direkter Test der Controller ohne Express
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testControllerLogic() {
  try {
    console.log('🧪 Teste Controller-Logik direkt...\n');
    
    const stageId = '3bfbd4a1-9d70-4a17-9b27-6fb22e241c1e';
    
    // Test 1: Initiationsriten direkt
    console.log('1️⃣ Teste Initiationsriten Query...');
    try {
      const initiationsriten = await prisma.initiationsriten.findMany({
        where: { stageId },
        include: {
          User: { select: { displayName: true, role: true } }
        },
        orderBy: [{ createdAt: 'desc' }]
      });
      console.log(`✅ Initiationsriten: ${initiationsriten.length} gefunden`);
      initiationsriten.forEach(item => {
        console.log(`  - "${item.title}" von ${item.User?.displayName || 'Unbekannt'}`);
      });
    } catch (error) {
      console.log('❌ Initiationsriten Fehler:', error.message);
    }
    
    // Test 2: Privilegien direkt
    console.log('\n2️⃣ Teste Privilegien Query...');
    try {
      const privilegien = await prisma.privileg.findMany({
        where: { stageId, isActive: true },
        include: {
          User_Privileg_creatorIdToUser: { select: { displayName: true, role: true } },
          User_Privileg_grantedToIdToUser: { select: { displayName: true, role: true } }
        },
        orderBy: [{ createdAt: 'desc' }]
      });
      console.log(`✅ Privilegien: ${privilegien.length} gefunden`);
      privilegien.forEach(item => {
        console.log(`  - "${item.title}" von ${item.User_Privileg_creatorIdToUser?.displayName || 'Unbekannt'}`);
      });
    } catch (error) {
      console.log('❌ Privilegien Fehler:', error.message);
    }
    
    // Test 3: Strafen direkt
    console.log('\n3️⃣ Teste Strafen Query...');
    try {
      const strafen = await prisma.strafe.findMany({
        where: { stageId },
        include: {
          User_Strafe_userIdToUser: { select: { displayName: true, email: true } },
          User_Strafe_adminByToUser: { select: { displayName: true, email: true } }
        },
        orderBy: [{ createdAt: 'desc' }]
      });
      console.log(`✅ Strafen: ${strafen.length} gefunden`);
      strafen.forEach(item => {
        console.log(`  - "${item.title}" für ${item.User_Strafe_userIdToUser?.email || 'Unbekannt'}`);
      });
    } catch (error) {
      console.log('❌ Strafen Fehler:', error.message);
    }
    
    // Test 4: TPE direkt
    console.log('\n4️⃣ Teste TPE Query...');
    try {
      const tpe = await prisma.tPEEintrag.findMany({
        where: { stageId },
        orderBy: [{ createdAt: 'desc' }]
      });
      console.log(`✅ TPE: ${tpe.length} gefunden`);
      tpe.forEach(item => {
        console.log(`  - "${item.title}"`);
      });
    } catch (error) {
      console.log('❌ TPE Fehler:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Allgemeiner Test-Fehler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testControllerLogic();