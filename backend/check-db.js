const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking database contents...\n');
    
    const goalCount = await prisma.goal.count();
    const taskCount = await prisma.task.count();
    const ruleCount = await prisma.rule.count();
    
    console.log(`Goals: ${goalCount}`);
    console.log(`Tasks: ${taskCount}`);
    console.log(`Rules: ${ruleCount}\n`);
    
    if (goalCount > 0) {
      console.log('Goals in database:');
      const goals = await prisma.goal.findMany();
      goals.forEach(goal => {
        console.log(`- ID: ${goal.id}, Title: ${goal.title}, Stage: ${goal.activeFromStage}-${goal.activeToStage || '∞'}`);
      });
    }
    
    if (ruleCount > 0) {
      console.log('\nRules in database:');
      const rules = await prisma.rule.findMany();
      rules.forEach(rule => {
        console.log(`- ID: ${rule.id}, Title: ${rule.title}, Stage: ${rule.activeFromStage}-${rule.activeToStage || '∞'}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();