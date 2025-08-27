const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function completeMigration() {
  try {
    console.log('🔧 Vervollständige Stage-Isolation Migration...');
    
    // Get Stage 1 ID for default assignments
    const stage1 = await prisma.stage.findFirst({
      where: { stageNumber: 1 }
    });
    
    if (!stage1) {
      throw new Error('Stage 1 nicht gefunden!');
    }
    
    console.log(`Default Stage ID: ${stage1.id}`);
    
    // Update Strafen that don't have stageId (add column first via raw SQL)
    console.log('\n1️⃣ Füge stageId zu Strafen hinzu...');
    try {
      await prisma.$executeRaw`ALTER TABLE "Strafe" ADD COLUMN IF NOT EXISTS "stageId" VARCHAR(255)`;
      console.log('✅ stageId Spalte zu Strafen hinzugefügt');
    } catch (error) {
      console.log('ℹ️ stageId Spalte existiert bereits oder anderer Fehler:', error.message);
    }
    
    const strafenToUpdate = await prisma.$queryRaw`SELECT id, "activeFromStage" FROM "Strafe" WHERE "stageId" IS NULL`;
    console.log(`Strafen zu aktualisieren: ${strafenToUpdate.length}`);
    
    for (const strafe of strafenToUpdate) {
      // Find the right stage based on activeFromStage
      const targetStage = await prisma.stage.findFirst({
        where: { stageNumber: strafe.activeFromStage || 1 }
      });
      
      await prisma.$executeRaw`UPDATE "Strafe" SET "stageId" = ${targetStage?.id || stage1.id} WHERE id = ${strafe.id}`;
      console.log(`  ✅ Strafe ID ${strafe.id} → Stage ${targetStage?.stageNumber || 1}`);
    }
    
    // Update TPEEintrag that don't have stageId
    console.log('\n2️⃣ Füge stageId zu TPE Einträgen hinzu...');
    try {
      await prisma.$executeRaw`ALTER TABLE "TPEEintrag" ADD COLUMN IF NOT EXISTS "stageId" VARCHAR(255)`;
      console.log('✅ stageId Spalte zu TPE hinzugefügt');
    } catch (error) {
      console.log('ℹ️ stageId Spalte existiert bereits oder anderer Fehler:', error.message);
    }
    
    const tpeToUpdate = await prisma.$queryRaw`SELECT id, "activeFromStage" FROM "TPEEintrag" WHERE "stageId" IS NULL`;
    console.log(`TPE Einträge zu aktualisieren: ${tpeToUpdate.length}`);
    
    for (const tpe of tpeToUpdate) {
      const targetStage = await prisma.stage.findFirst({
        where: { stageNumber: tpe.activeFromStage || 1 }
      });
      
      await prisma.$executeRaw`UPDATE "TPEEintrag" SET "stageId" = ${targetStage?.id || stage1.id} WHERE id = ${tpe.id}`;
      console.log(`  ✅ TPE ID ${tpe.id} → Stage ${targetStage?.stageNumber || 1}`);
    }
    
    console.log('\n3️⃣ Setze stageId als NOT NULL...');
    
    try {
      await prisma.$executeRaw`ALTER TABLE "Strafe" ALTER COLUMN "stageId" SET NOT NULL`;
      console.log('✅ Strafe.stageId ist jetzt NOT NULL');
    } catch (error) {
      console.log('⚠️ Strafe stageId NOT NULL Constraint:', error.message);
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE "TPEEintrag" ALTER COLUMN "stageId" SET NOT NULL`;
      console.log('✅ TPEEintrag.stageId ist jetzt NOT NULL');
    } catch (error) {
      console.log('⚠️ TPEEintrag stageId NOT NULL Constraint:', error.message);
    }
    
    console.log('\n4️⃣ Füge Foreign Key Constraints hinzu...');
    
    try {
      await prisma.$executeRaw`ALTER TABLE "Strafe" ADD CONSTRAINT "Strafe_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE`;
      console.log('✅ Strafe → Stage Foreign Key hinzugefügt');
    } catch (error) {
      console.log('⚠️ Strafe Foreign Key:', error.message);
    }
    
    try {
      await prisma.$executeRaw`ALTER TABLE "TPEEintrag" ADD CONSTRAINT "TPEEintrag_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE`;
      console.log('✅ TPEEintrag → Stage Foreign Key hinzugefügt');
    } catch (error) {
      console.log('⚠️ TPEEintrag Foreign Key:', error.message);
    }
    
    console.log('\n5️⃣ Erstelle Indizes...');
    
    try {
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Strafe_stageId_idx" ON "Strafe"("stageId")`;
      console.log('✅ Strafe stageId Index erstellt');
    } catch (error) {
      console.log('ℹ️ Strafe Index:', error.message);
    }
    
    try {
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "TPEEintrag_stageId_idx" ON "TPEEintrag"("stageId")`;
      console.log('✅ TPEEintrag stageId Index erstellt');
    } catch (error) {
      console.log('ℹ️ TPEEintrag Index:', error.message);
    }
    
    console.log('\n✅ Migration abgeschlossen!');
    
  } catch (error) {
    console.error('❌ Migration Fehler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

completeMigration();