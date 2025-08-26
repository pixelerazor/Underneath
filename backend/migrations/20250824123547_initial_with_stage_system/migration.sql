-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "displayName" TEXT,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "fcmToken" TEXT,
    "pushNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fcmTokenUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "domId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connection" (
    "id" TEXT NOT NULL,
    "domId" TEXT NOT NULL,
    "subId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredName" TEXT,
    "experienceLevel" TEXT,
    "availability" JSONB,
    "timezone" TEXT,
    "preferences" JSONB,
    "goals" TEXT,
    "boundaries" JSONB,
    "communication" JSONB,
    "completedSteps" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlobalPointAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "currentStage" INTEGER NOT NULL DEFAULT 1,
    "pointsInStage" INTEGER NOT NULL DEFAULT 0,
    "nextStageThreshold" INTEGER NOT NULL DEFAULT 100,
    "lastStageChange" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalPointAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stage" (
    "id" TEXT NOT NULL,
    "stageNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pointsRequired" INTEGER NOT NULL,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PointTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "pointsReward" INTEGER NOT NULL DEFAULT 10,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "activeFromStage" INTEGER NOT NULL DEFAULT 1,
    "activeToStage" INTEGER,
    "creatorId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "stageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "pointsPenalty" INTEGER NOT NULL DEFAULT -10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activeFromStage" INTEGER NOT NULL DEFAULT 1,
    "activeToStage" INTEGER,
    "creatorId" TEXT NOT NULL,
    "applicableToId" TEXT,
    "stageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "targetValue" INTEGER,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "pointsReward" INTEGER NOT NULL DEFAULT 50,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "deadline" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "activeFromStage" INTEGER NOT NULL DEFAULT 1,
    "activeToStage" INTEGER,
    "creatorId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "stageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StageProgression" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromStage" INTEGER NOT NULL,
    "toStage" INTEGER NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "confirmedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "karenzzeit" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "StageProgression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RuleViolation" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportedBy" TEXT,
    "description" TEXT,
    "severity" TEXT NOT NULL,
    "pointsPenalty" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "RuleViolation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "public"."Session"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_code_key" ON "public"."Invitation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_domId_key" ON "public"."Connection"("domId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_subId_key" ON "public"."Connection"("subId");

-- CreateIndex
CREATE INDEX "Connection_domId_idx" ON "public"."Connection"("domId");

-- CreateIndex
CREATE INDEX "Connection_subId_idx" ON "public"."Connection"("subId");

-- CreateIndex
CREATE INDEX "Connection_status_idx" ON "public"."Connection"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "public"."UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "public"."UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalPointAccount_userId_key" ON "public"."GlobalPointAccount"("userId");

-- CreateIndex
CREATE INDEX "GlobalPointAccount_userId_idx" ON "public"."GlobalPointAccount"("userId");

-- CreateIndex
CREATE INDEX "GlobalPointAccount_currentStage_idx" ON "public"."GlobalPointAccount"("currentStage");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_stageNumber_key" ON "public"."Stage"("stageNumber");

-- CreateIndex
CREATE INDEX "Stage_stageNumber_idx" ON "public"."Stage"("stageNumber");

-- CreateIndex
CREATE INDEX "Stage_pointsRequired_idx" ON "public"."Stage"("pointsRequired");

-- CreateIndex
CREATE INDEX "PointTransaction_userId_idx" ON "public"."PointTransaction"("userId");

-- CreateIndex
CREATE INDEX "PointTransaction_createdAt_idx" ON "public"."PointTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "PointTransaction_category_idx" ON "public"."PointTransaction"("category");

-- CreateIndex
CREATE INDEX "Task_creatorId_idx" ON "public"."Task"("creatorId");

-- CreateIndex
CREATE INDEX "Task_assignedToId_idx" ON "public"."Task"("assignedToId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "public"."Task"("status");

-- CreateIndex
CREATE INDEX "Task_activeFromStage_idx" ON "public"."Task"("activeFromStage");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "public"."Task"("dueDate");

-- CreateIndex
CREATE INDEX "Rule_creatorId_idx" ON "public"."Rule"("creatorId");

-- CreateIndex
CREATE INDEX "Rule_applicableToId_idx" ON "public"."Rule"("applicableToId");

-- CreateIndex
CREATE INDEX "Rule_isActive_idx" ON "public"."Rule"("isActive");

-- CreateIndex
CREATE INDEX "Rule_activeFromStage_idx" ON "public"."Rule"("activeFromStage");

-- CreateIndex
CREATE INDEX "Goal_creatorId_idx" ON "public"."Goal"("creatorId");

-- CreateIndex
CREATE INDEX "Goal_assignedToId_idx" ON "public"."Goal"("assignedToId");

-- CreateIndex
CREATE INDEX "Goal_status_idx" ON "public"."Goal"("status");

-- CreateIndex
CREATE INDEX "Goal_activeFromStage_idx" ON "public"."Goal"("activeFromStage");

-- CreateIndex
CREATE INDEX "StageProgression_userId_idx" ON "public"."StageProgression"("userId");

-- CreateIndex
CREATE INDEX "StageProgression_status_idx" ON "public"."StageProgression"("status");

-- CreateIndex
CREATE INDEX "StageProgression_triggeredAt_idx" ON "public"."StageProgression"("triggeredAt");

-- CreateIndex
CREATE INDEX "RuleViolation_userId_idx" ON "public"."RuleViolation"("userId");

-- CreateIndex
CREATE INDEX "RuleViolation_ruleId_idx" ON "public"."RuleViolation"("ruleId");

-- CreateIndex
CREATE INDEX "RuleViolation_status_idx" ON "public"."RuleViolation"("status");

-- CreateIndex
CREATE INDEX "RuleViolation_occurredAt_idx" ON "public"."RuleViolation"("occurredAt");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_domId_fkey" FOREIGN KEY ("domId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_domId_fkey" FOREIGN KEY ("domId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_subId_fkey" FOREIGN KEY ("subId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GlobalPointAccount" ADD CONSTRAINT "GlobalPointAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PointTransaction" ADD CONSTRAINT "PointTransaction_user_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PointTransaction" ADD CONSTRAINT "PointTransaction_pointAccount_fkey" FOREIGN KEY ("userId") REFERENCES "public"."GlobalPointAccount"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rule" ADD CONSTRAINT "Rule_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rule" ADD CONSTRAINT "Rule_applicableToId_fkey" FOREIGN KEY ("applicableToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rule" ADD CONSTRAINT "Rule_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goal" ADD CONSTRAINT "Goal_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goal" ADD CONSTRAINT "Goal_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goal" ADD CONSTRAINT "Goal_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StageProgression" ADD CONSTRAINT "StageProgression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StageProgression" ADD CONSTRAINT "StageProgression_toStage_fkey" FOREIGN KEY ("toStage") REFERENCES "public"."Stage"("stageNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RuleViolation" ADD CONSTRAINT "RuleViolation_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "public"."Rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RuleViolation" ADD CONSTRAINT "RuleViolation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
